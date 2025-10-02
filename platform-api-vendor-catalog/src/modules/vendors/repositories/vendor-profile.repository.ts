import { VendorProfile } from '../entities/vendor-profile.entity';

export abstract class VendorProfileRepository {
  /**
   * Finds a single vendor profile by its unique identifier.
   * @param id The UUID of the vendor profile.
   * @returns A promise that resolves to the VendorProfile entity or null if not found.
   */
  abstract findById(id: string): Promise<VendorProfile | null>;

  /**
   * Finds a single vendor profile by its associated user identifier.
   * @param userId The UUID of the user.
   * @returns A promise that resolves to the VendorProfile entity or null if not found.
   */
  abstract findByUserId(userId: string): Promise<VendorProfile | null>;
  
  /**
   * Creates a new vendor profile in the database.
   * @param vendorProfile The vendor profile entity to create.
   * @returns A promise that resolves to the newly created VendorProfile entity.
   */
  abstract create(vendorProfile: Partial<VendorProfile>): Promise<VendorProfile>;

  /**
   * Updates an existing vendor profile in the database.
   * @param id The UUID of the vendor profile to update.
   * @param vendorProfile The partial vendor profile entity with fields to update.
   * @returns A promise that resolves to the updated VendorProfile entity.
   */
  abstract update(id: string, vendorProfile: Partial<VendorProfile>): Promise<VendorProfile | null>;
  
  /**
   * Persists a vendor profile entity (create or update).
   * @param vendorProfile The vendor profile entity to save.
   * @returns A promise that resolves to the saved VendorProfile entity.
   */
  abstract save(vendorProfile: VendorProfile): Promise<VendorProfile>;
}