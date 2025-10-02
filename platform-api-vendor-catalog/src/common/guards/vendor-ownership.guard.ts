import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProductsService } from 'src/modules/products/products.service';
import { VendorsService } from 'src/modules/vendors/vendors.service';
import { CHECK_OWNERSHIP_KEY, ResourceType } from '../decorators/check-ownership.decorator';

@Injectable()
export class VendorOwnershipGuard implements CanActivate {
  private readonly logger = new Logger(VendorOwnershipGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly productsService: ProductsService,
    private readonly vendorsService: VendorsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const resourceType = this.reflector.get<ResourceType>(
      CHECK_OWNERSHIP_KEY,
      context.getHandler(),
    );
    if (!resourceType) {
      // If the decorator is not present, the guard does nothing.
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const params = request.params;

    if (!user || !user.vendorId) {
      this.logger.warn('VendorOwnershipGuard used on a route without a valid user or vendorId in token.');
      throw new ForbiddenException('Access denied. No valid vendor identity found.');
    }
    
    const resourceId = params.id || params.productId || params.vendorId;
    if (!resourceId) {
      this.logger.warn('VendorOwnershipGuard could not find a resource ID in request params.');
      throw new NotFoundException('Resource identifier not found in the request.');
    }

    const vendorIdFromToken = user.vendorId;
    let isOwner = false;

    this.logger.debug(`Checking ownership for resource type '${resourceType}', ID '${resourceId}' for vendor '${vendorIdFromToken}'.`);

    try {
      switch (resourceType) {
        case 'Product':
          isOwner = await this.productsService.isOwner(resourceId, vendorIdFromToken);
          break;
        case 'VendorProfile':
          // Here we assume the resourceId IS the vendorId
          isOwner = resourceId === vendorIdFromToken;
          break;
        // Add other resource types like 'ProductCategory', 'VendorLicense' here
        default:
          this.logger.error(`Unhandled resource type in VendorOwnershipGuard: ${resourceType}`);
          throw new ForbiddenException('Internal server error: ownership check misconfigured.');
      }
    } catch (error) {
        this.logger.error(`Error during ownership check: ${error.message}`, error.stack);
        throw new ForbiddenException('An error occurred while verifying ownership.');
    }


    if (!isOwner) {
      this.logger.warn(`Ownership check failed. Vendor '${vendorIdFromToken}' does not own resource '${resourceType}' with ID '${resourceId}'.`);
      throw new ForbiddenException('You do not have permission to access or modify this resource.');
    }
    
    this.logger.debug(`Ownership confirmed for vendor '${vendorIdFromToken}' on resource '${resourceId}'.`);
    return true;
  }
}