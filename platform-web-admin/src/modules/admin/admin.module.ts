import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { MessagingModule } from '../../shared/infrastructure/messaging/messaging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuditLog]),
    UsersModule,
    forwardRef(() => AuthModule), // To use Auth Guards within AdminController
    MessagingModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}