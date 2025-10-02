import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { DeliveryStatus } from './delivery-status.enum';
import { DomainException } from '../../../shared/domain/domain.exception';
import { Point } from 'geojson';

@Entity('delivery_tasks')
export class DeliveryTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  orderId: string;

  @Index({ where: '"riderId" IS NOT NULL' })
  @Column('uuid', { nullable: true })
  riderId: string | null;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.ALLOCATING,
  })
  status: DeliveryStatus;

  @Column({ type: 'timestamp with time zone', nullable: true })
  acceptedAt: Date | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  arrivedAtStoreAt: Date | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  pickedUpAt: Date | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  arrivedAtDestinationAt: Date | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  deliveredAt: Date | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  podType: 'PHOTO' | 'OTP' | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  podData: string | null; // S3 key for PHOTO, OTP value for OTP

  @Column({ type: 'timestamp with time zone', nullable: true })
  podTimestamp: Date | null;

  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  podLocation: Point | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  protected constructor() {}

  public static create(orderId: string): DeliveryTask {
    const task = new DeliveryTask();
    task.orderId = orderId;
    task.status = DeliveryStatus.ALLOCATING;
    return task;
  }

  public accept(riderId: string): void {
    if (
      this.status !== DeliveryStatus.ALLOCATING &&
      this.status !== DeliveryStatus.ALLOCATION_FAILED
    ) {
      throw new DomainException(
        `Cannot accept a task that is in '${this.status}' status.`,
      );
    }
    this.riderId = riderId;
    this.status = DeliveryStatus.ACCEPTED;
    this.acceptedAt = new Date();
  }

  public arriveAtStore(): void {
    if (this.status !== DeliveryStatus.ACCEPTED) {
      throw new DomainException(
        `Cannot arrive at store for a task that is in '${this.status}' status.`,
      );
    }
    this.status = DeliveryStatus.ARRIVED_AT_STORE;
    this.arrivedAtStoreAt = new Date();
  }

  public pickUp(): void {
    if (this.status !== DeliveryStatus.ARRIVED_AT_STORE) {
      throw new DomainException(
        `Cannot pick up a task that is in '${this.status}' status.`,
      );
    }
    this.status = DeliveryStatus.IN_TRANSIT;
    this.pickedUpAt = new Date();
  }

  public arriveAtDestination(): void {
    if (this.status !== DeliveryStatus.IN_TRANSIT) {
      throw new DomainException(
        `Cannot arrive at destination for a task that is in '${this.status}' status.`,
      );
    }
    this.status = DeliveryStatus.ARRIVED_AT_DESTINATION;
    this.arrivedAtDestinationAt = new Date();
  }

  public deliver(
    podType: 'PHOTO' | 'OTP',
    podData: string,
    podLocation: Point,
  ): void {
    if (this.status !== DeliveryStatus.ARRIVED_AT_DESTINATION) {
      throw new DomainException(
        `Cannot deliver a task that is in '${this.status}' status.`,
      );
    }
    this.podType = podType;
    this.podData = podData;
    this.podLocation = podLocation;
    this.podTimestamp = new Date();
    this.status = DeliveryStatus.DELIVERED;
    this.deliveredAt = this.podTimestamp;
  }

  public failAllocation(): void {
    if (this.status !== DeliveryStatus.ALLOCATING) {
      throw new DomainException(
        `Cannot fail allocation for a task that is in '${this.status}' status.`,
      );
    }
    this.status = DeliveryStatus.ALLOCATION_FAILED;
    this.riderId = null;
  }

  public cancel(): void {
    const cancellableStates = [
      DeliveryStatus.ALLOCATING,
      DeliveryStatus.ACCEPTED,
      DeliveryStatus.ARRIVED_AT_STORE,
      DeliveryStatus.IN_TRANSIT,
      DeliveryStatus.ALLOCATION_FAILED,
    ];
    if (!cancellableStates.includes(this.status)) {
      throw new DomainException(
        `Cannot cancel a task that is in '${this.status}' status.`,
      );
    }
    this.status = DeliveryStatus.CANCELLED;
  }
}