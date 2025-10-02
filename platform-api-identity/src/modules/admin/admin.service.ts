import { Injectable, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { User, UserStatus } from '../users/entities/user.entity';
import { CognitoService } from '../../shared/infrastructure/cognito/cognito.service';
import { EventPublisherService } from '../../shared/infrastructure/messaging/event-publisher.service';
import { UserSuspendedEvent, UserApprovedEvent, UserRejectedEvent } from '@platform-contracts/events/user-events';
import { AuditLog } from './entities/audit-log.entity';
import { SuspendUserDto } from './dto/suspend-user.dto';
import { PageDto, PageMetaDto, PageOptionsDto } from '@platform-contracts/dtos/page.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
    private readonly cognitoService: CognitoService,
    private readonly eventPublisherService: EventPublisherService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Retrieves a paginated list of users with 'pending_verification' status.
   * @param pageOptionsDto - DTO for pagination options.
   * @returns A paginated list of users.
   */
  async getPendingRegistrations(pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder
      .where('user.status = :status', { status: UserStatus.PENDING_VERIFICATION })
      .orderBy('user.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  /**
   * Retrieves full details for a single registration application.
   * @param userId - The ID of the user to retrieve.
   * @returns The user entity with relations.
   */
  async getRegistrationDetails(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      // Add relations to documents, etc., as needed
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    return user;
  }

  /**
   * Suspends a user account.
   * @param actingAdminId - The ID of the admin performing the action.
   * @param targetUserId - The ID of the user to suspend.
   * @param suspendUserDto - DTO containing the reason for suspension.
   */
  async suspendUser(actingAdminId: string, targetUserId: string, suspendUserDto: SuspendUserDto): Promise<void> {
    const { reason } = suspendUserDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const targetUser = await queryRunner.manager.findOne(User, { where: { id: targetUserId } });
      if (!targetUser) {
        throw new NotFoundException(`User with ID ${targetUserId} not found.`);
      }
      if (targetUser.status === UserStatus.SUSPENDED) {
        throw new ConflictException(`User ${targetUserId} is already suspended.`);
      }

      const oldStatus = targetUser.status;
      targetUser.status = UserStatus.SUSPENDED;

      // 1. Update user in local DB
      await queryRunner.manager.save(targetUser);

      // 2. Disable user in Cognito
      await this.cognitoService.disableUser(targetUser.cognitoSub);
      this.logger.log(`User ${targetUserId} disabled in Cognito.`);

      // 3. Create Audit Log Entry
      const actingAdmin = await queryRunner.manager.findOne(User, { where: { id: actingAdminId } });
      const auditLog = this.auditLogRepository.create({
        admin: actingAdmin,
        action: 'USER_SUSPEND',
        targetEntity: 'User',
        targetEntityId: targetUserId,
        changedData: {
          from: { status: oldStatus },
          to: { status: UserStatus.SUSPENDED },
          reason: reason,
        },
      });
      await queryRunner.manager.save(auditLog);

      await queryRunner.commitTransaction();
      this.logger.log(`User ${targetUserId} suspended by admin ${actingAdminId}. Reason: ${reason}`);

      // 4. Publish Event
      const event = new UserSuspendedEvent({
        userId: targetUserId,
        reason: reason,
        suspendedBy: actingAdminId,
        suspendedAt: new Date().toISOString(),
      });
      await this.eventPublisherService.publish(event);
    } catch (error) {
      this.logger.error(`Failed to suspend user ${targetUserId}: ${error.message}`, error.stack);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Approves a user registration.
   * @param actingAdminId - The ID of the admin performing the action.
   * @param targetUserId - The ID of the user to approve.
   */
  async approveRegistration(actingAdminId: string, targetUserId: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const targetUser = await queryRunner.manager.findOne(User, { where: { id: targetUserId } });
        if (!targetUser) {
            throw new NotFoundException(`User with ID ${targetUserId} not found.`);
        }
        if (targetUser.status !== UserStatus.PENDING_VERIFICATION) {
            throw new ConflictException(`User ${targetUserId} is not pending verification.`);
        }

        targetUser.status = UserStatus.ACTIVE;
        await queryRunner.manager.save(targetUser);
        await this.cognitoService.enableUser(targetUser.cognitoSub);

        const actingAdmin = await queryRunner.manager.findOne(User, { where: { id: actingAdminId } });
        const auditLog = this.auditLogRepository.create({
            admin: actingAdmin, action: 'REGISTRATION_APPROVE', targetEntity: 'User', targetEntityId: targetUserId,
        });
        await queryRunner.manager.save(auditLog);

        await queryRunner.commitTransaction();
        this.logger.log(`Registration for user ${targetUserId} approved by admin ${actingAdminId}.`);

        const event = new UserApprovedEvent({ userId: targetUserId, approvedBy: actingAdminId, approvedAt: new Date().toISOString() });
        await this.eventPublisherService.publish(event);

    } catch (error) {
        this.logger.error(`Failed to approve registration for user ${targetUserId}: ${error.message}`, error.stack);
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
  }

  /**
   * Rejects a user registration.
   * @param actingAdminId - The ID of the admin performing the action.
   * @param targetUserId - The ID of the user to reject.
   * @param reason - The reason for rejection.
   */
  async rejectRegistration(actingAdminId: string, targetUserId: string, reason: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const targetUser = await queryRunner.manager.findOne(User, { where: { id: targetUserId } });
        if (!targetUser) {
            throw new NotFoundException(`User with ID ${targetUserId} not found.`);
        }
        if (targetUser.status !== UserStatus.PENDING_VERIFICATION) {
            throw new ConflictException(`User ${targetUserId} is not pending verification.`);
        }

        targetUser.status = UserStatus.REJECTED;
        await queryRunner.manager.save(targetUser);

        // Optionally, delete the user from Cognito to prevent login attempts
        await this.cognitoService.deleteUser(targetUser.cognitoSub);

        const actingAdmin = await queryRunner.manager.findOne(User, { where: { id: actingAdminId } });
        const auditLog = this.auditLogRepository.create({
            admin: actingAdmin, action: 'REGISTRATION_REJECT', targetEntity: 'User', targetEntityId: targetUserId,
            changedData: { reason }
        });
        await queryRunner.manager.save(auditLog);

        await queryRunner.commitTransaction();
        this.logger.log(`Registration for user ${targetUserId} rejected by admin ${actingAdminId}. Reason: ${reason}`);

        const event = new UserRejectedEvent({ userId: targetUserId, reason, rejectedBy: actingAdminId, rejectedAt: new Date().toISOString() });
        await this.eventPublisherService.publish(event);

    } catch (error) {
        this.logger.error(`Failed to reject registration for user ${targetUserId}: ${error.message}`, error.stack);
        await queryRunner.rollbackTransaction();
        throw error;
    } finally {
        await queryRunner.release();
    }
  }

  /**
   * Retrieves audit logs with pagination and filtering.
   */
  async getAuditLogs(pageOptionsDto: PageOptionsDto): Promise<PageDto<AuditLog>> {
    const { skip, take, order, q } = pageOptionsDto;
    
    const where: FindOptionsWhere<AuditLog> = {};
    if (q) {
      where.targetEntityId = ILike(`%${q}%`);
    }

    const [entities, itemCount] = await this.auditLogRepository.findAndCount({
      where,
      order: { createdAt: order },
      skip,
      take,
      relations: ['admin'],
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }
}