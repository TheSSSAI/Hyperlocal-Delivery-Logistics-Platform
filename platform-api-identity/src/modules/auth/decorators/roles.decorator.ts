import { SetMetadata } from '@nestjs/common';

// As per REQ-1-001, defining the core user classes of the three-sided marketplace plus Admin
export enum Role {
  Customer = 'customer',
  Vendor = 'vendor',
  Rider = 'rider',
  Admin = 'admin',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);