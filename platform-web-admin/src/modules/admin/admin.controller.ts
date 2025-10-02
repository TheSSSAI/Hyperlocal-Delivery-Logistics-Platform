import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType, UserStatus } from '../users/entities/user.entity';
import { SuspendUserDto } from './dto/suspend-user.dto';
import { User } from '../users/entities/user.entity';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { AuditLog } from './entities/audit-log.entity';
import { AuditLogPageOptionsDto } from './dto/audit-log-page-options.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserType.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('registrations/pending')
  @ApiOperation({ summary: 'Get all pending user registrations' })
  @ApiResponse({
    status: 200,
    description: 'A paginated list of users pending verification.',
    type: PageDto<User>,
  })
  getPendingRegistrations(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return this.adminService.getPendingRegistrations(pageOptionsDto);
  }

  @Patch('registrations/:userId/approve')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Approve a user registration' })
  @ApiParam({ name: 'userId', description: 'The ID of the user to approve' })
  @ApiResponse({ status: 204, description: 'User successfully approved.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 409, description: 'User is not in a pending state.' })
  async approveRegistration(@Param('userId') userId: string): Promise<void> {
    await this.adminService.approveRegistration(userId);
  }

  @Patch('registrations/:userId/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Reject a user registration' })
  @ApiParam({ name: 'userId', description: 'The ID of the user to reject' })
  @ApiResponse({ status: 204, description: 'User successfully rejected.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 409, description: 'User is not in a pending state.' })
  async rejectRegistration(
    @Param('userId') userId: string,
    @Body() body: { reason: string },
  ): Promise<void> {
    await this.adminService.rejectRegistration(userId, body.reason);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users with filtering and pagination' })
  @ApiQuery({ name: 'role', enum: UserType, required: false })
  @ApiQuery({ name: 'status', enum: UserStatus, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiResponse({
    status: 200,
    description: 'A paginated list of users.',
    type: PageDto<User>,
  })
  getAllUsers(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<User>> {
    return this.adminService.getAllUsers(pageOptionsDto);
  }

  @Patch('users/:userId/suspend')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Suspend a user account' })
  @ApiParam({ name: 'userId', description: 'The ID of the user to suspend' })
  @ApiResponse({ status: 204, description: 'User successfully suspended.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async suspendUser(
    @Param('userId') userId: string,
    @Body() suspendUserDto: SuspendUserDto,
  ): Promise<void> {
    await this.adminService.suspendUser(userId, suspendUserDto.reason);
  }
  
  @Patch('users/:userId/reactivate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Reactivate a suspended user account' })
  @ApiParam({ name: 'userId', description: 'The ID of the user to reactivate' })
  @ApiResponse({ status: 204, description: 'User successfully reactivated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async reactivateUser(
    @Param('userId') userId: string
  ): Promise<void> {
    await this.adminService.reactivateUser(userId);
  }


  @Delete('users/:userId/deactivate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deactivate a user account' })
  @ApiParam({ name: 'userId', description: 'The ID of the user to deactivate' })
  @ApiResponse({ status: 204, description: 'User successfully deactivated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async deactivateUser(@Param('userId') userId: string): Promise<void> {
    await this.adminService.deactivateUser(userId);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'A paginated list of audit log entries.',
    type: PageDto<AuditLog>,
  })
  getAuditLogs(
    @Query() pageOptionsDto: AuditLogPageOptionsDto,
  ): Promise<PageDto<AuditLog>> {
    return this.adminService.getAuditLogs(pageOptionsDto);
  }
}