import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAllocationService } from '../interfaces/allocation.service.interface';
import { InitiateAllocationDto } from '../dtos/initiate-allocation.dto';
import { IDeliveryTaskRepository } from 'src/modules/deliveries/interfaces/delivery-task.repository.interface';
import { IRiderLocationService } from 'src/modules/tracking/interfaces/rider-location.service.interface';
import { IMapboxService } from 'src/shared/mapbox/interfaces/mapbox.service.interface';
import { IEventPublisher } from 'src/shared/messaging/interfaces/event-publisher.interface';
import { DeliveryTask } from 'src/modules/deliveries/domain/delivery-task.entity';
import { DeliveryStatus } from 'src/modules/deliveries/domain/delivery-status.enum';
import { RiderAssignedEvent, AllocationFailedEvent, NewTaskOfferEvent } from '@platform-la-logistics-contracts/delivery-events';
import { IRiderLocationCacheService } from 'src/shared/cache/interfaces/rider-location-cache.interface';

interface AllocationState {
    orderId: string;
    attempts: number;
    excludedRiderIds: string[];
    vendorLocation: { latitude: number; longitude: number };
}

@Injectable()
export class AllocationService implements IAllocationService {
  private readonly logger = new Logger(AllocationService.name);
  private readonly MAX_ATTEMPTS: number;
  private readonly ALLOCATION_TIMEOUT_MS: number;
  private readonly RIDER_ACCEPTANCE_WINDOW_S: number;

  constructor(
    @Inject('IDeliveryTaskRepository') private readonly deliveryTaskRepo: IDeliveryTaskRepository,
    @Inject('IRiderLocationService') private readonly riderLocationService: IRiderLocationService,
    @Inject('IMapboxService') private readonly mapboxService: IMapboxService,
    @Inject('IEventPublisher') private readonly eventPublisher: IEventPublisher,
    @Inject('IRiderLocationCacheService') private readonly cacheService: IRiderLocationCacheService,
    private readonly configService: ConfigService,
  ) {
    this.MAX_ATTEMPTS = this.configService.get<number>('logistics.allocation.maxAttempts', 3);
    this.ALLOCATION_TIMEOUT_MS = this.configService.get<number>('logistics.allocation.timeoutMinutes', 5) * 60 * 1000;
    this.RIDER_ACCEPTANCE_WINDOW_S = this.configService.get<number>('logistics.allocation.riderAcceptanceWindowSeconds', 60);
  }

  async initiateAllocation(data: InitiateAllocationDto): Promise<void> {
    this.logger.log(`Initiating allocation for orderId: ${data.orderId}`);

    const existingTask = await this.deliveryTaskRepo.findByOrderId(data.orderId);
    if (existingTask) {
      this.logger.warn(`Allocation already in progress or completed for orderId: ${data.orderId}. Ignoring event.`);
      return;
    }

    const deliveryTask = new DeliveryTask();
    deliveryTask.orderId = data.orderId;
    deliveryTask.status = DeliveryStatus.ALLOCATING;
    
    const newTask = await this.deliveryTaskRepo.create(deliveryTask);

    const initialState: AllocationState = {
        orderId: data.orderId,
        attempts: 0,
        excludedRiderIds: [],
        vendorLocation: data.vendorLocation,
    };
    
    // Store initial state in Redis to manage the saga
    await this.cacheService.set(`allocation:${data.orderId}`, JSON.stringify(initialState), this.ALLOCATION_TIMEOUT_MS);

    // Start the allocation process immediately
    this.findAndOfferTask(data.orderId);
  }

  private async findAndOfferTask(orderId: string): Promise<void> {
    const stateJson = await this.cacheService.get(`allocation:${orderId}`);
    if (!stateJson) {
        this.logger.warn(`Allocation state for order ${orderId} expired or not found. Halting allocation.`);
        return;
    }
    
    let state: AllocationState = JSON.parse(stateJson);
    state.attempts++;

    if (state.attempts > this.MAX_ATTEMPTS) {
        this.logger.warn(`Max allocation attempts reached for order ${orderId}. Failing allocation.`);
        await this.failAllocation(orderId, 'Max attempts reached');
        return;
    }

    this.logger.log(`Allocation attempt #${state.attempts} for order ${orderId}`);
    
    // 1. Find nearby riders
    const nearbyRiderIds = await this.riderLocationService.findNearbyRiders(state.vendorLocation, 5000); // 5km radius
    const eligibleRiders = nearbyRiderIds.filter(id => !state.excludedRiderIds.includes(id));
    
    if (eligibleRiders.length === 0) {
        this.logger.warn(`No eligible riders found for order ${orderId}. Retrying in 30 seconds.`);
        // Schedule a retry instead of immediate failure
        setTimeout(() => this.findAndOfferTask(orderId), 30000);
        return;
    }

    // 2. Score and select best rider (simple scoring for now)
    // TODO: Fetch rider ratings and current load from Identity/Rider service for more complex scoring.
    const bestRiderId = eligibleRiders[0]; // Simplest: pick the closest one

    // 3. Offer task
    await this.offerTaskToRider(orderId, bestRiderId, state);
  }

  private async offerTaskToRider(orderId: string, riderId: string, state: AllocationState): Promise<void> {
    this.logger.log(`Offering order ${orderId} to rider ${riderId}`);
    
    // TODO: Fetch full customer address and details from Order service
    const customerLocation = { latitude: 19.0760, longitude: 72.8777 }; // Mock customer location

    // Get route details for the offer
    const route = await this.mapboxService.getOptimizedRoute([
        { latitude: state.vendorLocation.latitude, longitude: state.vendorLocation.longitude },
        customerLocation
    ]);

    const taskOfferEvent = new NewTaskOfferEvent({
        orderId: orderId,
        riderId: riderId,
        vendorName: 'Mock Vendor', // TODO: Get from DTO
        vendorAddress: 'Mock Vendor Address',
        customerAddress: 'Mock Customer Address',
        estimatedDistance: route.distance,
        estimatedDuration: route.duration,
        estimatedEarnings: 50.0 // TODO: Calculate earnings
    });
    
    await this.eventPublisher.publish('delivery.new_task_offer', taskOfferEvent);

    // Update state
    state.excludedRiderIds.push(riderId);
    await this.cacheService.set(`allocation:${orderId}`, JSON.stringify(state), this.ALLOCATION_TIMEOUT_MS);

    // Set a timeout for this specific offer
    setTimeout(async () => {
        const task = await this.deliveryTaskRepo.findByOrderId(orderId);
        if (task && task.status === DeliveryStatus.ALLOCATING) {
            this.logger.log(`Rider ${riderId} did not accept order ${orderId} in time. Re-allocating.`);
            this.findAndOfferTask(orderId);
        }
    }, this.RIDER_ACCEPTANCE_WINDOW_S * 1000);
  }

  async handleTaskAccepted(orderId: string, riderId: string): Promise<void> {
    this.logger.log(`Rider ${riderId} accepted task for order ${orderId}`);
    const task = await this.deliveryTaskRepo.findByOrderId(orderId);

    if (!task) throw new NotFoundException('Delivery task not found');
    if (task.status !== DeliveryStatus.ALLOCATING) {
        this.logger.warn(`Task for order ${orderId} already accepted or in invalid state: ${task.status}`);
        return; // Idempotency
    }

    task.riderId = riderId;
    task.status = DeliveryStatus.ACCEPTED;
    await this.deliveryTaskRepo.update(task.id, task);

    await this.cacheService.del(`allocation:${orderId}`); // End the saga

    const event = new RiderAssignedEvent({ orderId, deliveryTaskId: task.id, riderId });
    await this.eventPublisher.publish('delivery.rider_assigned', event);
    this.logger.log(`Published RiderAssignedEvent for order ${orderId}`);
  }

  async handleTaskRejected(orderId: string, riderId: string): Promise<void> {
    this.logger.log(`Rider ${riderId} rejected task for order ${orderId}`);
    const task = await this.deliveryTaskRepo.findByOrderId(orderId);
    
    if (!task || task.status !== DeliveryStatus.ALLOCATING) {
        this.logger.warn(`Cannot process rejection for order ${orderId}, task not found or in invalid state.`);
        return;
    }

    // Immediately try to find another rider
    this.findAndOfferTask(orderId);
  }

  private async failAllocation(orderId: string, reason: string): Promise<void> {
    const task = await this.deliveryTaskRepo.findByOrderId(orderId);
    if (!task) return;

    task.status = DeliveryStatus.ALLOCATION_FAILED;
    await this.deliveryTaskRepo.update(task.id, task);
    await this.cacheService.del(`allocation:${orderId}`);

    const event = new AllocationFailedEvent({ orderId, reason });
    await this.eventPublisher.publish('delivery.allocation_failed', event);
    this.logger.log(`Published AllocationFailedEvent for order ${orderId}`);
  }
}