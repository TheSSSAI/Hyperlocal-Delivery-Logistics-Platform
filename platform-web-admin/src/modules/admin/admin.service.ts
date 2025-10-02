import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { UserStatus, UserType } from '../users/entities/user.entity';
import { SuspendUserDto } from './dto/suspend-user.dto';
import { EventPublisherService } from '../../shared/infrastructure/messaging/event-publisher.service';
import { AuditLogEvent, UserStatusChangeEvent } from '../../shared/infrastructure/messaging/events';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly eventPublisher: EventPublisherService,
  ) {}

  /**
   * Approves a pending registration for a Vendor or Rider.
   * @param targetUserId - The ID of the user to approve.
   * @param adminUser - The administrator performing the action.
   * @returns The updated user entity.
   */
  async approveRegistration(targetUserId: string, adminUser: User): Promise<User> {
    this.logger.log(`Admin ${adminUser.id} attempting to approve registration for user ${targetUserId}`);

    const userToApprove = await this.usersService.findUserById(targetUserId);
    if (!userToApprove) {
      throw new NotFoundException(`User with ID ${targetUserId} not found.`);
    }

    if (userToApprove.status !== UserStatus.PENDING_VERIFICATION) {
      throw new ConflictException(`User is not pending verification. Current status: ${userToApprove.status}`);
    }

    const oldStatus = userToApprove.status;
    const updatedUser = await this.usersService.updateUserStatus(targetUserId, UserStatus.ACTIVE);

    const userStatusChangeEvent = new UserStatusChangeEvent({
      userId: updatedUser.id,
      userType: updatedUser.userType,
      newStatus: UserStatus.ACTIVE,
      oldStatus: oldStatus,
      actor: {
        id: adminUser.id,
        type: adminUser.userType,
      },
      reason: 'Registration approved by administrator.'
    });

    await this.eventPublisher.publish('user.status.changed', userStatusChangeEvent);
    
    this.logAdminAction(adminUser.id, targetUserId, 'REGISTRATION_APPROVE', {
      oldStatus,
      newStatus: UserStatus.ACTIVE,
    });
    
    this.logger.log(`Admin ${adminUser.id} successfully approved registration for user ${targetUserId}`);
    return updatedUser;
  }

  /**
   * Rejects a pending registration for a Vendor or Rider.
   * @param targetUserId - The ID of the user to reject.
   * @param reason - The reason for rejection.
   * @param adminUser - The administrator performing the action.
   * @returns The updated user entity.
   */
  async rejectRegistration(targetUserId: string, reason: string, adminUser: User): Promise<User> {
    this.logger.log(`Admin ${adminUser.id} attempting to reject registration for user ${targetUserId}`);
    
    const userToReject = await this.usersService.findUserById(targetUserId);
    if (!userToReject) {
        throw new NotFoundException(`User with ID ${targetUserId} not found.`);
    }

    if (userToReject.status !== UserStatus.PENDING_VERIFICATION) {
        throw new ConflictException(`User is not pending verification. Current status: ${userToReject.status}`);
    }

    const oldStatus = userToReject.status;
    // Note: The UsersService should handle storing the rejection reason if required by the data model.
    const updatedUser = await this.usersService.updateUserStatus(targetUserId, UserStatus.REJECTED);

    const userStatusChangeEvent = new UserStatusChangeEvent({
      userId: updatedUser.id,
      userType: updatedUser.userType,
      newStatus: UserStatus.REJECTED,
      oldStatus: oldStatus,
      actor: {
        id: adminUser.id,
        type: adminUser.userType,
      },
      reason: `Registration rejected by administrator: ${reason}`
    });

    await this.eventPublisher.publish('user.status.changed', userStatusChangeEvent);

    this.logAdminAction(adminUser.id, targetUserId, 'REGISTRATION_REJECT', {
      oldStatus,
      newStatus: UserStatus.REJECTED,
      reason,
    });

    this.logger.log(`Admin ${adminUser.id} successfully rejected registration for user ${targetUserId}`);
    return updatedUser;
  }

  /**
   * Suspends an active user account.
   * @param targetUserId - The ID of the user to suspend.
   * @param suspendUserDto - DTO containing the reason for suspension.
   * @param adminUser - The administrator performing the action.
   * @returns The updated user entity.
   */
  async suspendUser(targetUserId: string, suspendUserDto: SuspendUserDto, adminUser: User): Promise<User> {
    this.logger.log(`Admin ${adminUser.id} attempting to suspend user ${targetUserId} for reason: ${suspendUserDto.reason}`);
    
    const userToSuspend = await this.usersService.findUserById(targetUserId);
    if (!userToSuspend) {
        throw new NotFoundException(`User with ID ${targetUserId} not found.`);
    }

    if (userToSuspend.status === UserStatus.SUSPENDED) {
        throw new ConflictException('User is already suspended.');
    }

    const oldStatus = userToSuspend.status;
    const updatedUser = await this.usersService.updateUserStatus(targetUserId, UserStatus.SUSPENDED);

    const userStatusChangeEvent = new UserStatusChangeEvent({
      userId: updatedUser.id,
      userType: updatedUser.userType,
      newStatus: UserStatus.SUSPENDED,
      oldStatus: oldStatus,
      actor: {
        id: adminUser.id,
        type: adminUser.userType,
      },
      reason: `Account suspended by administrator: ${suspendUserDto.reason}`
    });
    
    await this.eventPublisher.publish('user.status.changed', userStatusChangeEvent);

    this.logAdminAction(adminUser.id, targetUserId, 'USER_SUSPEND', {
        oldStatus,
        newStatus: UserStatus.SUSPENDED,
        reason: suspendUserDto.reason,
    });
    
    this.logger.log(`Admin ${adminUser.id} successfully suspended user ${targetUserId}`);
    return updatedUser;
  }

  /**
   * Deactivates a user account.
   * @param targetUserId - The ID of the user to deactivate.
   * @param adminUser - The administrator performing the action.
   * @returns The updated user entity.
   */
  async deactivateUser(targetUserId: string, adminUser: User): Promise<User> {
    this.logger.log(`Admin ${adminUser.id} attempting to deactivate user ${targetUserId}.`);
    
    const userToDeactivate = await this.usersService.findUserById(targetUserId);
    if (!userToDeactivate) {
        throw new NotFoundException(`User with ID ${targetUserId} not found.`);
    }

    if (userToDeactivate.status === UserStatus.DEACTIVATED) {
        throw new ConflictException('User is already deactivated.');
    }
    
    const oldStatus = userToDeactivate.status;
    const updatedUser = await this.usersService.updateUserStatus(targetUserId, UserStatus.DEACTIVATED);

    const userStatusChangeEvent = new UserStatusChangeEvent({
      userId: updatedUser.id,
      userType: updatedUser.userType,
      newStatus: UserStatus.DEACTIVATED,
      oldStatus: oldStatus,
      actor: {
        id: adminUser.id,
        type: adminUser.userType,
      },
      reason: 'Account deactivated by administrator.'
    });
    
    await this.eventPublisher.publish('user.status.changed', userStatusChangeEvent);

    this.logAdminAction(adminUser.id, targetUserId, 'USER_DEACTIVATE', {
      oldStatus,
      newStatus: UserStatus.DEACTIVATED,
    });
    
    this.logger.log(`Admin ${adminUser.id} successfully deactivated user ${targetUserId}`);
    return updatedUser;
  }

  /**
   * Helper method to publish an audit log event.
   * @param adminId - The ID of the administrator performing the action.
   * @param targetId - The ID of the entity being acted upon.
   * @param action - A string identifying the action.
   * @param changedData - An object detailing the changes.
   */
  private logAdminAction(adminId: string, targetId: string, action: string, changedData: object): void {
    const auditEvent = new AuditLogEvent({
        adminId,
        targetId,
        action,
        changedData,
    });
    
    this.eventPublisher.publish('audit.log.admin_action', auditEvent);
    this.logger.log(`Published audit log event for action: ${action} by admin: ${adminId} on target: ${targetId}`);
  }
}