import { Injectable, Inject, Logger, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { IDeliveryTaskRepository } from '../interfaces/delivery-task.repository.interface';
import { SubmitPodDto } from '../dtos/submit-pod.dto';
import { DeliveryTask } from '../domain/delivery-task.entity';
import { DeliveryStatus } from '../domain/delivery-status.enum';
import { IEventPublisher } from 'src/shared/messaging/interfaces/event-publisher.interface';
import { DeliveryCompletedEvent } from '@platform-la-logistics-contracts/delivery-events';

// NOTE: In a real-world scenario, OTP validation would likely involve a call to the Order service.
// For the scope of this logistics service, we assume the provided OTP is valid, and we just record it.
// The Order service would consume the DeliveryCompletedEvent and perform final validation if needed.

@Injectable()
export class PodService {
  private readonly logger = new Logger(PodService.name);

  constructor(
    @Inject('IDeliveryTaskRepository')
    private readonly deliveryTaskRepository: IDeliveryTaskRepository,
    @Inject('IEventPublisher')
    private readonly eventPublisher: IEventPublisher,
  ) {}

  /**
   * Submits Proof of Delivery for a given delivery task.
   * This is the final step in the delivery lifecycle.
   * @param taskId - The ID of the delivery task.
   * @param riderId - The ID of the rider submitting the POD.
   * @param submitPodDto - The Proof of Delivery data.
   * @returns The updated DeliveryTask entity.
   * @throws NotFoundException if the task does not exist.
   * @throws ForbiddenException if the task is not assigned to the calling rider.
   * @throws BadRequestException if the task is not in a valid state for POD submission.
   */
  async submitPod(
    taskId: string,
    riderId: string,
    submitPodDto: SubmitPodDto,
  ): Promise<DeliveryTask> {
    this.logger.log(`Attempting to submit POD for task ${taskId} by rider ${riderId}`);

    const deliveryTask = await this.deliveryTaskRepository.findById(taskId);

    if (!deliveryTask) {
      throw new NotFoundException(`Delivery task with ID ${taskId} not found.`);
    }

    if (deliveryTask.riderId !== riderId) {
      throw new ForbiddenException(`You are not authorized to submit POD for this task.`);
    }

    // A rider should only be able to submit POD if they have arrived at the destination.
    // In a more complex state machine, this might be 'ARRIVED_AT_DESTINATION'.
    // We also allow retries if it's already 'DELIVERED'.
    if (deliveryTask.status !== DeliveryStatus.IN_TRANSIT && deliveryTask.status !== DeliveryStatus.DELIVERED) {
       throw new BadRequestException(`Task is not in a valid state for Proof of Delivery. Current status: ${deliveryTask.status}`);
    }
    
    // If already delivered, we might allow updating POD info but not re-triggering events.
    // For now, we'll treat it as idempotent and just return the existing state.
    if (deliveryTask.status === DeliveryStatus.DELIVERED) {
      this.logger.warn(`POD for task ${taskId} was already submitted. Returning existing state.`);
      return deliveryTask;
    }

    deliveryTask.podType = submitPodDto.podType;
    deliveryTask.podData = submitPodDto.podData;
    deliveryTask.podSubmittedAt = new Date();
    
    if (submitPodDto.location) {
        deliveryTask.podLocation = {
            type: 'Point',
            coordinates: [submitPodDto.location.longitude, submitPodDto.location.latitude],
        };
    }
    
    deliveryTask.status = DeliveryStatus.DELIVERED;
    deliveryTask.deliveredAt = new Date();

    const updatedTask = await this.deliveryTaskRepository.update(deliveryTask.id, deliveryTask);
    this.logger.log(`Successfully submitted POD for task ${taskId}. Status updated to DELIVERED.`);

    // Publish an event for downstream services (e.g., Payments, Order service)
    const event = new DeliveryCompletedEvent({
        orderId: updatedTask.orderId,
        deliveryTaskId: updatedTask.id,
        riderId: updatedTask.riderId,
        deliveredAt: updatedTask.deliveredAt,
        podType: updatedTask.podType,
    });
    
    await this.eventPublisher.publish('delivery.completed', event);
    this.logger.log(`Published DeliveryCompletedEvent for order ${updatedTask.orderId}`);

    return updatedTask;
  }
}