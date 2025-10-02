import { VendorBusinessHour } from '../entities/vendor-business-hour.entity';

export abstract class VendorBusinessHourRepository {
  /**
   * Finds all business hours for a specific vendor profile.
   * @param vendorProfileId The UUID of the vendor profile.
   * @returns A promise that resolves to an array of VendorBusinessHour entities.
   */
  abstract findByVendorId(vendorProfileId: string): Promise<VendorBusinessHour[]>;

  /**
   * Updates or creates the set of business hours for a specific vendor.
   * This method should handle replacing the entire set of hours transactionally.
   * @param vendorProfileId The UUID of the vendor profile.
   * @param businessHours The array of new business hours.
   * @returns A promise that resolves to the array of saved VendorBusinessHour entities.
   */
  abstract replaceAllForVendor(
    vendorProfileId: string,
    businessHours: Partial<VendorBusinessHour>[],
  ): Promise<VendorBusinessHour[]>;
}