import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { CustomerProfile } from './entities/customer-profile.entity';
import { Address } from './entities/address.entity';
import { UserRepository } from './repositories/user.repository';
import { CognitoModule } from '../../shared/infrastructure/cognito/cognito.module';
import { MessagingModule } from '../../shared/infrastructure/messaging/messaging.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, CustomerProfile, Address]),
    CognitoModule,
    MessagingModule,
    forwardRef(() => AuthModule), // To handle circular dependency if UsersService needs Auth details
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}