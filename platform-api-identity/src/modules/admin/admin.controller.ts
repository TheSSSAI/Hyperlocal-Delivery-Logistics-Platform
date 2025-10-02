import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { SuspendUserDto } from './dto/suspend-user.dto';
import { RejectRegistrationDto } from './dto/reject-registration.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/dto/jwt-payload.interface';
import { AuditLog } from './entities/audit-log.entity';
import { User } from '../users/entities/user.entity';

@ApiTags('Administration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserType.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('registrations/:userId/approve')
  @ApiOperation({ summary: 'Approve a pending user registration' })
  @ApiParam({ name: 'userId', description: 'The ID of the user to approve' })
  @ApiResponse({
    status: 200,
    description: 'User registration approved successfully.',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict. User is not in a pending state.',
  })
  approveRegistration(
    @CurrentUser() admin: JwtPayload,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<User> {
    return this.adminService.approveRegistration(admin.userId, userId);
  }

  @Post('registrations/:userId/reject')
  @ApiOperation({ summary: 'Reject a pending user registration' })
  @ApiParam({ name: 'userId', description: 'The ID of the user to reject' })
  @ApiResponse({
    status: 200,
    description: 'User registration rejected successfully.',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict. User is not in a pending state.',
  })
  rejectRegistration(
    @CurrentUser() admin: JwtPayload,
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() rejectDto: RejectRegistrationDto,
  ): Promise<User> {
    return this.adminService.rejectRegistration(
      admin.userId,
      userId,
      rejectDto.reason,
    );
  }

  @Post('users/:userId/suspend')
  @ApiOperation({ summary: 'Suspend a user account' })
  @ApiParam({ name: 'userId', description: 'The ID of the user to suspend' })
  @ApiResponse({
    status: 200,
    description: 'User suspended successfully.',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  suspendUser(
    @CurrentUser() admin: JwtPayload,
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() suspendDto: SuspendUserDto,
  ): Promise<User> {
    return this.adminService.suspendUser(
      admin.userId,
      userId,
      suspendDto.reason,
    );
  }

  @Post('users/:userId/reactivate')
  @ApiOperation({ summary: 'Reactivate a suspended user account' })
  @ApiParam({ name: 'userId', description: 'The ID of the user to reactivate' })
  @ApiResponse({
    status: 200,
    description: 'User reactivated successfully.',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  reactivateUser(
    @CurrentUser() admin: JwtPayload,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<User> {
    return this.adminService.reactivateUser(admin.userId, userId);
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get administrator audit logs' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved audit logs.',
    type: [AuditLog],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getAuditLogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<{ logs: AuditLog[]; total: number }> {
    return this.adminService.getAuditLogs({ page, limit });
  }
}