import { Injectable, Logger, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserType, UserStatus } from './entities/user.entity';
import { CustomerProfile } from './entities/customer-profile.entity';
import { EventPublisherService } from '../../shared/infrastructure/messaging/event-publisher.service';
import { UserRegisteredEvent, UserProfileUpdatedEvent, UserAnonymizedEvent } from './events';
import { IUserRepository } from './repositories/user.repository';
import { Address } from './entities/address.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @InjectRepository(CustomerProfile) private readonly customerProfileRepository: Repository<CustomerProfile>,
    @InjectRepository(Address) private readonly addressRepository: Repository<Address>,
    private readonly eventPublisher: EventPublisherService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Creates a new user and their associated customer profile within a transaction.
   * Publishes a UserRegisteredEvent on success.
   * @param createUserDto - Data for creating the user.
   * @param cognitoSub - The unique identifier from AWS Cognito.
   * @returns The newly created User entity.
   * @throws {ConflictException} If a user with the same mobile number already exists.
   */
  async create(createUserDto: CreateUserDto, cognitoSub: string): Promise<User> {
    const { mobileNumber, userType } = createUserDto;
    
    const existingUser = await this.userRepository.findByMobileNumber(mobileNumber);
    if (existingUser) {
      this.logger.warn(`Registration attempt with existing mobile number: ${mobileNumber}`);
      throw new ConflictException('A user with this mobile number already exists.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newUser = queryRunner.manager.create(User, {
        mobileNumber,
        userType,
        cognitoSub,
        status: userType === UserType.CUSTOMER ? UserStatus.ACTIVE : UserStatus.PENDING_VERIFICATION,
      });

      const savedUser = await queryRunner.manager.save(newUser);

      if (userType === UserType.CUSTOMER) {
        const newProfile = queryRunner.manager.create(CustomerProfile, {
          user: savedUser,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
        });
        await queryRunner.manager.save(newProfile);
        savedUser.customerProfile = newProfile;
      }
      
      await queryRunner.commitTransaction();

      this.logger.log(`User created successfully with ID: ${savedUser.id}`);
      
      const event = new UserRegisteredEvent(savedUser.id, savedUser.mobileNumber, savedUser.userType);
      this.eventPublisher.publish('user.registered', event);

      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to create user for mobile number ${mobileNumber}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Finds a user by their unique ID.
   * @param id - The UUID of the user.
   * @returns The User entity.
   * @throws {NotFoundException} If no user is found.
   */
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id }, relations: ['customerProfile', 'addresses', 'consents'] });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  /**
   * Finds a user by their mobile number.
   * @param mobileNumber - The user's 10-digit mobile number.
   * @returns The User entity or null if not found.
   */
  async findByMobileNumber(mobileNumber: string): Promise<User | null> {
    return this.userRepository.findByMobileNumber(mobileNumber);
  }

  /**
   * Updates a customer's profile information.
   * @param userId - The ID of the user to update.
   * @param updateProfileDto - The data to update.
   * @returns The updated User entity.
   * @throws {NotFoundException} If the user or their profile is not found.
   */
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(userId);
    if (!user.customerProfile) {
      throw new NotFoundException(`Customer profile for user ${userId} not found.`);
    }

    const { firstName, lastName, email } = updateProfileDto;
    
    // Using query builder for partial updates
    await this.customerProfileRepository.update(user.customerProfile.id, { firstName, lastName });
    
    if (email) {
      await this.userRepository.update(userId, { email });
    }
    
    this.logger.log(`Profile updated for user ID: ${userId}`);

    const event = new UserProfileUpdatedEvent(userId, { emailChanged: !!email, nameChanged: !!(firstName || lastName) });
    this.eventPublisher.publish('user.profile.updated', event);
    
    // Re-fetch the updated entity to return the complete object
    return this.findById(userId);
  }

  /**
   * Anonymizes a user's Personally Identifiable Information (PII) as per REQ-1-023.
   * This action is irreversible. It replaces PII with generic placeholders but preserves
   * transactional integrity.
   * @param userId - The ID of the user to anonymize.
   */
  async anonymizeUser(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ 
        where: { id: userId }, 
        relations: ['customerProfile', 'addresses'] 
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found for anonymization.`);
    }

    if (user.status === UserStatus.DEACTIVATED) {
        this.logger.warn(`User ${userId} is already deactivated/anonymized. Skipping.`);
        return;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const anonymizedIdentifier = `anon_${new Date().getTime()}`;

        // Anonymize User entity
        user.email = `${anonymizedIdentifier}@anonymized.local`;
        user.mobileNumber = `${anonymizedIdentifier}`;
        user.status = UserStatus.DEACTIVATED;
        await queryRunner.manager.save(user);

        // Anonymize CustomerProfile entity
        if (user.customerProfile) {
            user.customerProfile.firstName = 'Inactive';
            user.customerProfile.lastName = 'User';
            await queryRunner.manager.save(user.customerProfile);
        }

        // Delete associated addresses
        if (user.addresses && user.addresses.length > 0) {
            await queryRunner.manager.remove(user.addresses);
        }

        // Here you would also anonymize related entities in other domains
        // via events, e.g., anonymize PII in historical orders.
        // For this service, we only handle the Identity domain entities.

        await queryRunner.commitTransaction();

        this.logger.log(`Successfully anonymized user with ID: ${userId}`);

        const event = new UserAnonymizedEvent(userId);
        this.eventPublisher.publish('user.anonymized', event);

    } catch (error) {
        await queryRunner.rollbackTransaction();
        this.logger.error(`Failed to anonymize user ${userId}`, error.stack);
        throw error;
    } finally {
        await queryRunner.release();
    }
  }

  // Placeholder for other user management methods like address management
  async addAddress(userId: string, addressData: Partial<Address>): Promise<Address> {
      const user = await this.findById(userId);
      const newAddress = this.addressRepository.create({ ...addressData, user });
      return this.addressRepository.save(newAddress);
  }
}