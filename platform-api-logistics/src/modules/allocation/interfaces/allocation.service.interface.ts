import { InitiateAllocationDto } from '../dtos/initiate-allocation.dto';

export const ALLOCATION_SERVICE = 'IAllocationService';

export interface IAllocationService {
  /**
   * Initiates the rider allocation process for a new order.
   * This method triggers a complex saga that finds, offers, and assigns a rider.
   * @param data - DTO containing order and vendor location details.
   * @throws NoRidersAvailableException if no online riders are found in the initial search.
   */
  initiateAllocation(data: InitiateAllocationDto): Promise<void>;
}