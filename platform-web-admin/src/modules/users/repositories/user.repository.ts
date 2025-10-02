import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserStatus, UserType } from '../entities/user-status.enum';
import { CreateUserDto } from '../dto/create-user.dto';
import { CustomerProfile } from '../entities/customer-profile.entity';
import { IUserRepository } from '../interfaces/user-repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(CustomerProfile)
    private readonly customerProfileRepository: Repository<CustomerProfile>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    cognitoSub: string,
  ): Promise<User> {
    const { mobileNumber, userType, firstName, lastName } = createUserDto;
    this.logger.log(
      `Creating new user with mobile number: ${mobileNumber} and type: ${userType}`,
    );

    const newUser = this.userRepository.create({
      mobileNumber,
      userType,
      cognitoSub,
      status:
        userType === UserType.CUSTOMER
          ? UserStatus.ACTIVE
          : UserStatus.PENDING_VERIFICATION,
    });

    // For simplicity, we create a customer profile here.
    // In a full implementation, this might be handled by a factory or a separate service.
    if (userType === UserType.CUSTOMER && firstName && lastName) {
      const customerProfile = this.customerProfileRepository.create({
        firstName,
        lastName,
        user: newUser,
      });
      newUser.customerProfile = customerProfile;
    }

    try {
      // TypeORM's save with cascade will insert both user and profile if it's a new user.
      const savedUser = await this.userRepository.save(newUser);
      this.logger.log(`Successfully created user with ID: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      this.logger.error(
        `Failed to create user for mobile number ${mobileNumber}`,
        error.stack,
      );
      // Let the service layer handle the specific exception type to throw
      throw error;
    }
  }

  async findByMobileNumber(mobileNumber: string): Promise<User | null> {
    this.logger.log(`Finding user by mobile number: ${mobileNumber}`);
    return this.userRepository.findOne({
      where: { mobileNumber },
      relations: ['customerProfile'],
    });
  }

  async findById(id: string): Promise<User | null> {
    this.logger.log(`Finding user by ID: ${id}`);
    return this.userRepository.findOne({
      where: { id },
      relations: ['customerProfile', 'addresses', 'consents'],
    });
  }

  async findOneBy(where: FindOptionsWhere<User>): Promise<User | null> {
    this.logger.log(`Finding user by custom where clause`);
    return this.userRepository.findOne({
      where,
      relations: ['customerProfile'],
    });
  }

  async exists(mobileNumber: string): Promise<boolean> {
    this.logger.log(`Checking existence of user by mobile: ${mobileNumber}`);
    const count = await this.userRepository.count({ where: { mobileNumber } });
    return count > 0;
  }

  async updateUserStatus(id: string, status: UserStatus): Promise<User> {
    this.logger.log(`Updating status for user ${id} to ${status}`);
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    user.status = status;
    return this.userRepository.save(user);
  }

  async anonymizeUser(id: string): Promise<void> {
    this.logger.warn(`Anonymizing PII for user with ID: ${id}`);

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['customerProfile', 'addresses'],
    });

    if (!user) {
      this.logger.error(`Cannot anonymize: User with ID ${id} not found.`);
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    // This operation should be transactional. TypeORM's `save` on an entity with relations
    // can handle this if cascades are set up, but manual transaction is safer.
    // For this example, we'll save entities sequentially.

    if (user.customerProfile) {
      user.customerProfile.firstName = 'Deleted';
      user.customerProfile.lastName = 'User';
      await this.customerProfileRepository.save(user.customerProfile);
    }

    // Assuming Address entity is part of this module. If not, this would be an event.
    if (user.addresses && user.addresses.length > 0) {
      // In a real system, we'd have a separate AddressRepository
      const addressRepo =
        this.userRepository.manager.getRepository('Address');
      for (const address of user.addresses) {
        address.addressLine1 = 'Anonymized';
        address.addressLine2 = null;
        address.city = 'Anonymized';
        address.landmark = null;
        address.pincode = '000000';
        address.location = null; // Anonymize geopoint
        await addressRepo.save(address);
      }
    }

    user.status = UserStatus.DEACTIVATED;
    user.email = `${user.id}@anonymized.local`;
    // We keep the mobile number but in a deactivated state, or change it to an anonymized format
    // depending on the business rule (if number can be reused).
    // Let's assume for DPDP, we should anonymize it too.
    user.mobileNumber = `anonymized-${user.id}`;

    await this.userRepository.save(user);
    this.logger.log(`Successfully anonymized user with ID: ${id}`);
  }
}