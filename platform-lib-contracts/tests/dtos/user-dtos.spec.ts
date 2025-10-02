import { describe, it, expect } from '@jest/globals';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

import { UserDto, CustomerProfileDto, VendorProfileDto, RiderProfileDto } from '../../src/dtos/users/user.dto';
import { CreateUserDto } from '../../src/dtos/users/create-user.dto';
import { UserRole } from '../../src/enums/user-role.enum';

describe('User DTO Contracts', () => {
  describe('CreateUserDto', () => {
    const CreateUserDtoSchema = z.object({
      mobileNumber: z
        .string()
        .regex(
          /^[6-9]\d{9}$/,
          'Mobile number must be a valid 10-digit Indian number',
        ),
      email: z.string().email('Invalid email format').optional(),
      role: z.nativeEnum(UserRole),
      firstName: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
    });

    it('should validate a correct CreateUserDto for a Customer', () => {
      // ARRANGE
      const mockDto: CreateUserDto = {
        mobileNumber: '9876543210',
        email: 'test.customer@example.com',
        role: UserRole.Customer,
        firstName: 'Test',
        lastName: 'Customer',
      };

      // ACT & ASSERT
      expect(() => CreateUserDtoSchema.parse(mockDto)).not.toThrow();
    });

    it('should fail validation for an invalid mobile number', () => {
      // ARRANGE
      const mockDto: CreateUserDto = {
        mobileNumber: '12345', // Invalid
        role: UserRole.Customer,
      };

      // ACT
      const result = CreateUserDtoSchema.safeParse(mockDto);

      // ASSERT
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['mobileNumber']);
      }
    });

    it('should fail validation for a missing role', () => {
        // ARRANGE
        const mockDto: any = {
          mobileNumber: '9876543210',
          // role is missing
        };
  
        // ACT
        const result = CreateUserDtoSchema.safeParse(mockDto);
  
        // ASSERT
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toEqual(['role']);
        }
      });
  });

  describe('UserDto', () => {
    // Define schemas for each profile type
    const CustomerProfileSchema = z.object({
      firstName: z.string(),
      lastName: z.string(),
    });

    const VendorProfileSchema = z.object({
      storeName: z.string(),
      averageRating: z.number().min(0).max(5),
    });
    
    const RiderProfileSchema = z.object({
        firstName: z.string(),
        lastName: z.string(),
        isOnline: z.boolean(),
    });

    // Use a discriminated union to validate the profile based on the role
    const UserDtoSchema = z.object({
        id: z.string().uuid(),
        role: z.nativeEnum(UserRole),
        status: z.string(), // e.g., 'active', 'pending_verification'
      }).and(
        z.discriminatedUnion('role', [
            z.object({ role: z.literal(UserRole.Customer), profile: CustomerProfileSchema }),
            z.object({ role: z.literal(UserRole.Vendor), profile: VendorProfileSchema }),
            z.object({ role: z.literal(UserRole.Rider), profile: RiderProfileSchema }),
            z.object({ role: z.literal(UserRole.Administrator), profile: z.null() }), // Admins might not have a public profile
        ])
    );

    it('should validate a correct UserDto for a Customer', () => {
      // ARRANGE
      const mockDto: UserDto = {
        id: uuidv4(),
        role: UserRole.Customer,
        status: 'active',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
        } as CustomerProfileDto,
      };

      // ACT & ASSERT
      expect(() => UserDtoSchema.parse(mockDto)).not.toThrow();
    });

    it('should validate a correct UserDto for a Vendor', () => {
        // ARRANGE
        const mockDto: UserDto = {
          id: uuidv4(),
          role: UserRole.Vendor,
          status: 'active',
          profile: {
            storeName: 'Global Bites Kitchen',
            averageRating: 4.5,
          } as VendorProfileDto,
        };
  
        // ACT & ASSERT
        expect(() => UserDtoSchema.parse(mockDto)).not.toThrow();
    });

    it('should validate a correct UserDto for a Rider', () => {
        // ARRANGE
        const mockDto: UserDto = {
          id: uuidv4(),
          role: UserRole.Rider,
          status: 'active',
          profile: {
            firstName: 'Suresh',
            lastName: 'Kumar',
            isOnline: true,
          } as RiderProfileDto,
        };
  
        // ACT & ASSERT
        expect(() => UserDtoSchema.parse(mockDto)).not.toThrow();
    });

    it('should fail validation if profile shape does not match the role', () => {
        // ARRANGE: A user with role 'Customer' but a 'Vendor' profile shape
        const mockDto: any = {
            id: uuidv4(),
            role: UserRole.Customer, // Role is Customer
            status: 'active',
            profile: {
              storeName: 'Mismatched Store', // But profile is for a Vendor
              averageRating: 4.0,
            },
          };

        // ACT
        const result = UserDtoSchema.safeParse(mockDto);

        // ASSERT
        expect(result.success).toBe(false);
        if (!result.success) {
            // Zod's discriminated union error will point to the mismatch
            expect(result.error.issues[0].message).toContain("Invalid discriminator value");
        }
    });

    it('should fail validation if a required field like id is missing', () => {
        // ARRANGE
        const mockDto: any = {
            // id is missing
            role: UserRole.Customer,
            status: 'active',
            profile: {
              firstName: 'John',
              lastName: 'Doe',
            },
          };

        // ACT
        const result = UserDtoSchema.safeParse(mockDto);

        // ASSERT
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues.some(issue => issue.path.includes('id'))).toBe(true);
        }
    });
  });
});