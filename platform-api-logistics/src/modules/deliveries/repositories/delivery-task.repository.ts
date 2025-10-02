import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryTask } from '../domain/delivery-task.entity';
import { IDeliveryTaskRepository } from '../interfaces/delivery-task.repository.interface';
import { DeliveryStatus } from '../domain/delivery-status.enum';

@Injectable()
export class DeliveryTaskRepository implements IDeliveryTaskRepository {
  private readonly logger = new Logger(DeliveryTaskRepository.name);

  constructor(
    @InjectRepository(DeliveryTask)
    private readonly taskRepository: Repository<DeliveryTask>,
  ) {}

  async create(taskData: Partial<DeliveryTask>): Promise<DeliveryTask> {
    this.logger.log(`Creating new delivery task for order ${taskData.orderId}`);
    try {
      const task = this.taskRepository.create(taskData);
      return await this.taskRepository.save(task);
    } catch (error) {
      this.logger.error(
        `Failed to create delivery task: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findById(id: string): Promise<DeliveryTask | null> {
    this.logger.log(`Finding delivery task by id: ${id}`);
    try {
      return await this.taskRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(
        `Failed to find delivery task by id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByOrderId(orderId: string): Promise<DeliveryTask | null> {
    this.logger.log(`Finding delivery task by orderId: ${orderId}`);
    try {
      return await this.taskRepository.findOne({ where: { orderId } });
    } catch (error) {
      this.logger.error(
        `Failed to find delivery task by orderId ${orderId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findActiveByRiderId(riderId: string): Promise<DeliveryTask | null> {
    this.logger.log(`Finding active delivery task for riderId: ${riderId}`);
    try {
      return await this.taskRepository
        .createQueryBuilder('task')
        .where('task.riderId = :riderId', { riderId })
        .andWhere('task.status NOT IN (:...finalStatuses)', {
          finalStatuses: [
            DeliveryStatus.DELIVERED,
            DeliveryStatus.ALLOCATION_FAILED, // Technically riderId would be null
            'CANCELLED', // Assuming a general CANCELLED status might exist
          ],
        })
        .getOne();
    } catch (error) {
      this.logger.error(
        `Failed to find active delivery task for riderId ${riderId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(
    id: string,
    updateData: Partial<DeliveryTask>,
  ): Promise<DeliveryTask | null> {
    this.logger.log(`Updating delivery task with id: ${id}`);
    try {
      await this.taskRepository.update(id, updateData);
      return this.findById(id);
    } catch (error) {
      this.logger.error(
        `Failed to update delivery task ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async save(task: DeliveryTask): Promise<DeliveryTask> {
    this.logger.log(`Saving delivery task with id: ${task.id}`);
    try {
      return await this.taskRepository.save(task);
    } catch (error) {
      this.logger.error(
        `Failed to save delivery task ${task.id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}