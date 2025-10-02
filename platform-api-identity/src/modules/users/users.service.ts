import { Injectable, Logger, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserStatus, UserType } from './entities/user.entity';
import { CognitoService } from '../../shared/infrastructure/cognito/cognito.service';
import { DataSource, Repository } from 'typeorm';
import { CustomerProfile } from './entities/customer-profile.entity';
import { EventPublisherService } from '../../shared/infrastructure/messaging/event-publisher.service';
import { UserRegisteredEvent } from '@platform-contracts/events/user-events';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Address } from './entities/address.entity';
import { UserAnonymizationSaga } from './sagas/user-anonymization.saga';
import { PIIChangedEvent } from '@platform-contracts/events/pii-events';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(CustomerProfile)
    private readonly customerProfileRepository: Repository<CustomerProfile>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly cognitoService: CognitoService,
    private readonly eventPublisherService: EventPublisherService,
    private readonly userAnonymizationSaga: UserAnonymizationSaga,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Finds a user by their unique mobile number.
   * @param mobileNumber The mobile number to search for.
   * @returns The user entity or null if not found.
   */
  async findByMobileNumber(mobileNumber: string): Promise<User | null> {
    return this.userRepository.findByMobileNumber(mobileNumber);
  }

  /**
   * Finds a user by their unique ID.
   * @param id The UUID of the user.
   * @returns The user entity.
   * @throws NotFoundException if the user does not exist.
   */
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  /**
   * Creates a new user in both the local database and AWS Cognito.
   * This operation is transactional.
   * @param createUserDto - The DTO containing user creation data.
   * @returns The newly created user entity.
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { mobileNumber, userType } = createUserDto;

    const existingUser = await this.findByMobileNumber(mobileNumber);
    if (existingUser) {
      throw new ConflictException('A user with this mobile number already exists.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Create user in AWS Cognito
      this.logger.log(`Creating user in Cognito for mobile: ${mobileNumber}`);
      const cognitoSub = await this.cognitoService.createUserInCognito(mobileNumber, [
        { Name: 'custom:userType', Value: userType },
      ]);

      // 2. Create user in local database
      this.logger.log(`Creating user in local DB for mobile: ${mobileNumber}`);
      const user = this.userRepository.create({
        mobileNumber,
        userType,
        cognitoSub,
        status: userType === UserType.CUSTOMER ? UserStatus.ACTIVE : UserStatus.PENDING_VERIFICATION,
      });
      const savedUser = await queryRunner.manager.save(user);

      // 3. Create role-specific profiles if needed
      if (userType === UserType.CUSTOMER) {
        const customerProfile = this.customerProfileRepository.create({
          user: savedUser,
        });
        await queryRunner.manager.save(customerProfile);
        savedUser.customerProfile = customerProfile;
      }
      // Note: Vendor and Rider profiles are created during their specific registration flows.

      await queryRunner.commitTransaction();
      this.logger.log(`User ${savedUser.id} created successfully.`);

      // 4. Publish event after successful transaction
      const event = new UserRegisteredEvent({
        userId: savedUser.id,
        userType: savedUser.userType,
        mobileNumber: savedUser.mobileNumber,
        registeredAt: savedUser.createdAt.toISOString(),
      });
      await this.eventPublisherService.publish(event);

      return savedUser;
    } catch (error) {
      this.logger.error(`Error during user creation for ${mobileNumber}: ${error.message}`, error.stack);
      await queryRunner.rollbackTransaction();
      // Attempt to clean up Cognito user if DB transaction failed
      if (error.code !== 'UsernameExistsException') {
         // Implement cleanup logic if needed
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Updates the profile of the currently authenticated user.
   * @param userId The ID of the user to update.
   * @param updateProfileDto The data to update.
   * @returns The updated user entity.
   */
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['customerProfile'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    let piiChanged = false;
    const oldProfileState = { email: user.email, name: user.customerProfile?.firstName };

    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      user.email = updateProfileDto.email;
      piiChanged = true;
    }
    
    if (user.customerProfile && updateProfileDto.firstName && updateProfileDto.firstName !== user.customerProfile.firstName) {
        user.customerProfile.firstName = updateProfileDto.firstName;
        piiChanged = true;
    }
    
    if (user.customerProfile && updateProfileDto.lastName && updateProfileDto.lastName !== user.customerProfile.lastName) {
        user.customerProfile.lastName = updateProfileDto.lastName;
    }
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        await queryRunner.manager.save(user);
        if(user.customerProfile) {
            await queryRunner.manager.save(user.customerProfile);
        }
        await queryRunner.commitTransaction();

        if (piiChanged) {
          this.logger.log(`PII changed for user ${userId}. Publishing event.`);
          const event = new PIIChangedEvent({
            userId,
            changedFields: Object.keys(updateProfileDto),
            timestamp: new Date().toISOString(),
          });
          await this.eventPublisherService.publish(event);
        }
        
        return user;
    } catch(error) {
        this.logger.error(`Failed to update profile for user ${userId}`, error.stack);
        await queryRunner.rollbackTransaction();
        throw new BadRequestException('Profile update failed.');
    } finally {
        await queryRunner.release();
    }
  }

  /**
   * Initiates the data erasure process for a user.
   * @param userId The ID of the user requesting erasure.
   */
  async requestDataErasure(userId: string): Promise<void> {
    this.logger.warn(`Data erasure requested for user ${userId}.`);
    // In a real application, we would first check for blocking conditions,
    // like active orders, by communicating with the Order Service.
    // For this implementation, we proceed directly to the anonymization saga.
    
    const user = await this.findById(userId);

    // This starts the distributed saga.
    await this.userAnonymizationSaga.start(user);

    this.logger.log(`Data erasure process initiated for user ${userId}.`);
  }

   // --- Address Management ---
   
  async getAddresses(userId: string): Promise<Address[]> {
    return this.addressRepository.find({ where: { user: { id: userId } } });
  }

  async addAddress(userId: string, addressData: Partial<Address>): Promise<Address> {
    const user = await this.findById(userId);
    // Here we would add geofencing validation by calling a logistics/location service
    const newAddress = this.addressRepository.create({ ...addressData, user });
    return this.addressRepository.save(newAddress);
  }

  async updateAddress(userId: string, addressId: string, addressData: Partial<Address>): Promise<Address> {
    const address = await this.addressRepository.findOne({ where: { id: addressId, user: { id: userId } } });
    if (!address) {
      throw new NotFoundException(`Address with ID ${addressId} not found or does not belong to user.`);
    }
    // Geofencing validation would also be needed here.
    Object.assign(address, addressData);
    return this.addressRepository.save(address);
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    const result = await this.addressRepository.delete({ id: addressId, user: { id: userId } });
    if (result.affected === 0) {
      throw new NotFoundException(`Address with ID ${addressId} not found or does not belong to user.`);
    }
  }
}