import { DeliveryTask } from '../domain/delivery-task.entity';

export const DELIVERY_TASK_REPOSITORY = 'IDeliveryTaskRepository';

export interface IDeliveryTaskRepository {
  /**
   * Finds a delivery task by its unique identifier.
   * @param id - The UUID of the delivery task.
   * @returns A promise that resolves to the DeliveryTask entity or null if not found.
   */
  findById(id: string): Promise<DeliveryTask | null>;

  /**
   * Finds a delivery task by its associated order ID.
   * @param orderId - The UUID of the order.
   * @returns A promise that resolves to the DeliveryTask entity or null if not found.
   */
  findByOrderId(orderId: string): Promise<DeliveryTask | null>;

  /**
   * Finds the currently active (non-terminal state) delivery task for a specific rider.
   * @param riderId - The UUID of the rider.
   * @returns A promise that resolves to the active DeliveryTask entity or null if none exists.
   */
  findActiveTaskByRiderId(riderId: string): Promise<DeliveryTask | null>;

  /**
   * Creates a new delivery task in the persistence layer.
   * @param task - The DeliveryTask entity to create.
   * @returns A promise that resolves to the created DeliveryTask entity.
   */
  create(task: DeliveryTask): Promise<DeliveryTask>;

  /**
   * Updates an existing delivery task in the persistence layer.
   * @param task - The DeliveryTask entity with updated properties.
   * @returns A promise that resolves to the updated DeliveryTask entity.
   */
  update(task: DeliveryTask): Promise<DeliveryTask>;
}