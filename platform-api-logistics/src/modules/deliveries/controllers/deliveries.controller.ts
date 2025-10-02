import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Patch,
  Logger,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/auth/guards/roles.guard';
import { Roles } from 'src/shared/auth/decorators/roles.decorator';
import { Role } from 'src/shared/auth/enums/role.enum';
import { SubmitPodDto } from '../dtos/submit-pod.dto';
import { DeliveryTaskService } from '../services/delivery-task.service';
import { PodService } from '../services/pod.service';
import { UpdateDeliveryStatusDto } from '../dtos/update-delivery-status.dto';
import { DeliveryStatus } from '../domain/delivery-status.enum';

@ApiTags('Deliveries & Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeliveriesController {
  private readonly logger = new Logger(DeliveriesController.name);

  constructor(
    private readonly podService: PodService,
    private readonly deliveryTaskService: DeliveryTaskService,
  ) {}

  @Post(':taskId/pod')
  @Roles(Role.Rider)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Submit Proof of Delivery',
    description: 'Allows a rider to submit POD data (Photo or OTP) for a specific delivery task.',
  })
  @ApiParam({ name: 'taskId', description: 'The unique identifier of the delivery task.' })
  @ApiResponse({
    status: 200,
    description: 'Proof of Delivery submitted successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User is not the assigned rider.' })
  @ApiResponse({ status: 404, description: 'Delivery task not found.' })
  @ApiResponse({ status: 409, description: 'POD already submitted or task is not in a valid state.' })
  async submitProofOfDelivery(
    @Param('taskId') taskId: string,
    @Body() submitPodDto: SubmitPodDto,
    @Req() req: any,
  ): Promise<{ message: string }> {
    const riderId = req.user.userId;
    this.logger.log(`Rider ${riderId} submitting POD for task ${taskId}`);

    await this.podService.submitPod(riderId, taskId, submitPodDto);

    this.logger.log(`Successfully submitted POD for task ${taskId}`);
    return { message: 'Proof of Delivery submitted successfully.' };
  }

  @Patch(':taskId/status')
  @Roles(Role.Rider)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update Delivery Task Status',
    description: 'Allows a rider to sequentially update the status of their active delivery task.',
  })
  @ApiParam({ name: 'taskId', description: 'The unique identifier of the delivery task.' })
  @ApiResponse({
    status: 200,
    description: 'Task status updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid status transition or input data.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User is not the assigned rider.' })
  @ApiResponse({ status: 404, description: 'Delivery task not found.' })
  @ApiResponse({ status: 409, description: 'Invalid state transition for the task.' })
  async updateTaskStatus(
    @Param('taskId') taskId: string,
    @Body() updateDeliveryStatusDto: UpdateDeliveryStatusDto,
    @Req() req: any,
  ): Promise<{ message: string; newStatus: DeliveryStatus }> {
    const riderId = req.user.userId;
    const newStatus = updateDeliveryStatusDto.status;
    
    this.logger.log(`Rider ${riderId} updating status of task ${taskId} to ${newStatus}`);

    await this.deliveryTaskService.updateStatus(riderId, taskId, newStatus);
    
    this.logger.log(`Successfully updated status for task ${taskId} to ${newStatus}`);
    return { message: 'Task status updated successfully.', newStatus };
  }
}