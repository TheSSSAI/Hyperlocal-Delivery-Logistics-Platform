import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserType } from '../entities/user-type.enum';
import { UserStatus } from '../entities/user-status.enum';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

export abstract class IUserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByMobileNumber(mobileNumber: string): Promise<User | null>;
  abstract findByCognitoSub(cognitoSub: string): Promise<User | null>;
  abstract createUser(
    createUserDto: CreateUserDto,
    cognitoSub: string,
  ): Promise<User>;
  abstract updateUserStatus(userId: string, status: UserStatus): Promise<User>;
  abstract updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User>;
  abstract anonymizeUser(userId: string): Promise<void>;
  abstract userExistsByMobileNumber(mobileNumber: string): Promise<boolean>;
}

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    this.logger.log(`Finding user by id: ${id}`);
    return this.userRepository.findOne({
      where: { id },
      relations: ['customerProfile', 'consents'],
    });
  }

  async findByMobileNumber(mobileNumber: string): Promise<User | null> {
    this.logger.log(`Finding user by mobile number: ${mobileNumber}`);
    return this.userRepository.findOne({
      where: { mobileNumber },
      relations: ['customerProfile'],
    });
  }

  async findByCognitoSub(cognitoSub: string): Promise<User | null> {
    this.logger.log(`Finding user by Cognito SUB: ${cognitoSub}`);
    return this.userRepository.findOneBy({ cognitoSub });
  }

  async createUser(
    createUserDto: CreateUserDto,
    cognitoSub: string,
  ): Promise<User> {
    this.logger.log(`Creating new user for mobile: ${createUserDto.mobileNumber}`);
    const newUser = this.userRepository.create({
      ...createUserDto,
      cognitoSub,
      status: UserStatus.PENDING_VERIFICATION, // Default status
    });

    if (createUserDto.userType === UserType.CUSTOMER) {
      newUser.customerProfile = {
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        user: newUser,
      };
    }
    // Note: Vendor and Rider profiles would be created in their respective services
    // upon receiving a UserRegisteredEvent. This service only handles core user and customer profile.

    return this.userRepository.save(newUser);
  }

  async updateUserStatus(userId: string, status: UserStatus): Promise<User> {
    this.logger.log(`Updating status for user ${userId} to ${status}`);
    const user = await this.findById(userId);
    if (!user) {
      // This should ideally be caught by the service layer, but as a safeguard:
      throw new Error(`User with ID ${userId} not found.`);
    }
    user.status = status;
    return this.userRepository.save(user);
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    this.logger.log(`Updating profile for user ${userId}`);
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['customerProfile'],
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    // Update common User fields if they exist in the DTO
    if (updateProfileDto.email) {
      user.email = updateProfileDto.email;
    }

    // Update customer-specific fields
    if (user.customerProfile) {
      if (updateProfileDto.firstName) {
        user.customerProfile.firstName = updateProfileDto.firstName;
      }
      if (updateProfileDto.lastName) {
        user.customerProfile.lastName = updateProfileDto.lastName;
      }
    }

    return this.userRepository.save(user);
  }

  async anonymizeUser(userId: string): Promise<void> {
    this.logger.warn(`Anonymizing PII for user ${userId}`);
    // REQ-1-023: Anonymize PII in all associated records.
    // This replaces PII with generic, non-identifiable placeholders.
    await this.userRepository.update(userId, {
      email: `${userId}@anonymized.local`,
      mobileNumber: `0000000000`, // Cannot be null due to unique constraint, use a placeholder or handle constraint
      cognitoSub: `anonymized-${userId}`, // Break the link to Cognito
      status: UserStatus.DEACTIVATED,
      customerProfile: {
        firstName: 'Anonymized',
        lastName: 'User',
      },
    });
    this.logger.log(`Successfully anonymized user ${userId}`);
  }

  async userExistsByMobileNumber(mobileNumber: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { mobileNumber } });
    return count > 0;
  }
}