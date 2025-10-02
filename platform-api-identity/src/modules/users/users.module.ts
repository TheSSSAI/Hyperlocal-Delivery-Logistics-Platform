import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { CustomerProfile } from './entities/customer-profile.entity';
import { Address } from './entities/address.entity';
import { UserRepository } from './repositories/user.repository';
import { MessagingModule } from '../../shared/infrastructure/messaging/messaging.module';
import { ConfigModule } from '@nestjs/config';
import { CognitoModule } from '../../shared/infrastructure/cognito/cognito.module';
import { SnsModule } from '../../shared/infrastructure/sns/sns.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, CustomerProfile, Address]),
    MessagingModule,
    ConfigModule,
    CognitoModule,
    SnsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}