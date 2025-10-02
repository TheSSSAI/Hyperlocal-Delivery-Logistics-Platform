import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuditLog } from './entities/audit-log.entity';
import { UsersModule } from '../users/users.module';
import { CognitoModule } from '../../shared/infrastructure/cognito/cognito.module';
import { MessagingModule } from '../../shared/infrastructure/messaging/messaging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog]),
    UsersModule,
    CognitoModule,
    MessagingModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}