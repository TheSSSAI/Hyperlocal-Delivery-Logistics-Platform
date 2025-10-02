import { VendorLicense } from '../entities/vendor-license.entity';

export abstract class VendorLicenseRepository {
  /**
   * Finds all licenses associated with a specific vendor profile.
   * @param vendorProfileId The UUID of the vendor profile.
   * @returns A promise that resolves to an array of VendorLicense entities.
   */
  abstract findByVendorId(vendorProfileId: string): Promise<VendorLicense[]>;

  /**
   * Creates a new vendor license.
   * @param license The partial license data to create.
   * @returns A promise that resolves to the created VendorLicense entity.
   */
  abstract create(license: Partial<VendorLicense>): Promise<VendorLicense>;

  /**
   * Finds a single license by its unique identifier.
   * @param id The UUID of the license.
   * @returns A promise that resolves to the VendorLicense or null if not found.
   */
  abstract findById(id: string): Promise<VendorLicense | null>;

  /**
   * Updates an existing vendor license.
   * @param id The UUID of the license to update.
   * @param licenseUpdate The partial license data for the update.
   * @returns A promise that resolves to the updated VendorLicense entity.
   */
  abstract update(id: string, licenseUpdate: Partial<VendorLicense>): Promise<VendorLicense | null>;

  /**
   * Deletes a vendor license by its unique identifier.
   * @param id The UUID of the license to delete.
   * @returns A promise that resolves when the deletion is complete.
   */
  abstract delete(id: string): Promise<void>;
}