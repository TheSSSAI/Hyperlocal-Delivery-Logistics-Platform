import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { VendorProfile } from './entities/vendor-profile.entity';
import { VendorLicense } from './entities/vendor-license.entity';
import { VendorBusinessHour } from './entities/vendor-business-hour.entity';
import { VendorProfileRepository } from './repositories/vendor-profile.repository';
import { VendorLicenseRepository } from './repositories/vendor-license.repository';
import { VendorBusinessHourRepository } from './repositories/vendor-business-hour.repository';
import { ConfigModule } from '@nestjs/config';

/**
 * @module VendorsModule
 * @description Encapsulates all logic related to the "Vendor" sub-domain,
 * including profiles, licenses, and business hours, as per DDD principles.
 * This module is central to managing vendor data and their operational status.
 */
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      VendorProfile,
      VendorLicense,
      VendorBusinessHour,
    ]),
  ],
  controllers: [VendorsController],
  providers: [
    VendorsService,
    VendorProfileRepository,
    VendorLicenseRepository,
    VendorBusinessHourRepository,
  ],
  exports: [VendorsService], // Exporting for potential use in other modules, e.g., an Admin module.
})
export class VendorsModule {}