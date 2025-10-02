import { Injectable, Logger, NotFoundException, ForbiddenException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorProfile } from './entities/vendor-profile.entity';
import { VendorLicense } from './entities/vendor-license.entity';
import { VendorBusinessHour } from './entities/vendor-business-hour.entity';
import { CreateVendorProfileDto } from './dto/create-vendor-profile.dto';
import { UpdateVendorProfileDto } from './dto/update-vendor-profile.dto';
import { VendorAvailabilityDto } from './dto/vendor-availability.dto';
import { VendorNotFoundException } from '../../common/exceptions/vendor-not-found.exception';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class VendorsService {
    private readonly logger = new Logger(VendorsService.name);

    constructor(
        @InjectRepository(VendorProfile)
        private readonly vendorProfileRepository: Repository<VendorProfile>,
        @InjectRepository(VendorLicense)
        private readonly vendorLicenseRepository: Repository<VendorLicense>,
        @InjectRepository(VendorBusinessHour)
        private readonly vendorBusinessHourRepository: Repository<VendorBusinessHour>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ) {}

    async create(createVendorDto: CreateVendorProfileDto): Promise<VendorProfile> {
        this.logger.log(`Creating a new vendor profile for userId: ${createVendorDto.userId}`);
        const existingVendor = await this.vendorProfileRepository.findOne({ where: { userId: createVendorDto.userId }});
        if(existingVendor) {
            throw new ForbiddenException(`A vendor profile for this user already exists.`);
        }
        const vendorProfile = this.vendorProfileRepository.create(createVendorDto);
        const savedVendor = await this.vendorProfileRepository.save(vendorProfile);
        this.logger.log(`Vendor profile ${savedVendor.id} created successfully.`);
        return savedVendor;
    }

    async findOne(id: string): Promise<VendorProfile> {
        const cacheKey = `vendor_profile_${id}`;
        const cachedVendor = await this.cacheManager.get<VendorProfile>(cacheKey);
        if (cachedVendor) {
            this.logger.log(`Cache hit for vendor profile ${id}`);
            return cachedVendor;
        }

        this.logger.log(`Cache miss for vendor profile ${id}. Fetching from DB.`);
        const vendor = await this.vendorProfileRepository.findOne({
            where: { id },
            relations: ['licenses', 'businessHours'],
        });
        
        if (!vendor) {
            throw new VendorNotFoundException(id);
        }

        await this.cacheManager.set(cacheKey, vendor, 60 * 60 * 1000); // Cache for 1 hour
        return vendor;
    }

    async findByUserId(userId: string): Promise<VendorProfile> {
        const vendor = await this.vendorProfileRepository.findOneBy({ userId });
        if (!vendor) {
            throw new VendorNotFoundException(`No vendor profile found for user ID ${userId}`);
        }
        return this.findOne(vendor.id); // Use findOne to leverage caching
    }

    async update(id: string, updateVendorDto: UpdateVendorProfileDto): Promise<VendorProfile> {
        const vendor = await this.vendorProfileRepository.preload({
            id,
            ...updateVendorDto,
        });

        if (!vendor) {
            throw new VendorNotFoundException(id);
        }

        const updatedVendor = await this.vendorProfileRepository.save(vendor);
        await this.invalidateCache(id);
        this.logger.log(`Vendor profile ${id} updated.`);
        return updatedVendor;
    }

    async updateAvailability(id: string, availabilityDto: VendorAvailabilityDto): Promise<VendorProfile> {
        const vendor = await this.vendorProfileRepository.findOneBy({ id });
        if (!vendor) {
            throw new VendorNotFoundException(id);
        }

        // Business rule: A vendor cannot go offline if they have active orders.
        // This check would involve an RPC call to the Order service in a real microservice architecture.
        // const hasActiveOrders = await this.orderServiceClient.hasActiveOrdersForVendor(id);
        // if (hasActiveOrders && !availabilityDto.isOnline) {
        //   throw new ForbiddenException('Cannot go offline while you have active orders.');
        // }

        vendor.isOnline = availabilityDto.isOnline;
        const updatedVendor = await this.vendorProfileRepository.save(vendor);

        await this.invalidateCache(id);
        this.logger.log(`Vendor ${id} availability updated to ${availabilityDto.isOnline ? 'Online' : 'Offline'}`);
        return updatedVendor;
    }

    async remove(id: string): Promise<void> {
        const vendor = await this.vendorProfileRepository.findOneBy({ id });
        if (!vendor) {
            throw new VendorNotFoundException(id);
        }
        // Using soft-delete which is a built-in TypeORM feature if configured on the entity.
        await this.vendorProfileRepository.softRemove(vendor);
        await this.invalidateCache(id);
        this.logger.log(`Vendor profile ${id} has been soft-deleted.`);
    }

    /**
     * Checks if a user is the owner of a vendor profile.
     * @param userId The ID of the user from the JWT.
     * @param vendorId The ID of the vendor profile resource being accessed.
     * @returns A boolean indicating ownership.
     */
    async isOwner(userId: string, vendorId: string): Promise<boolean> {
        try {
            const vendor = await this.vendorProfileRepository.findOne({
                where: { id: vendorId, userId: userId },
                select: ['id'],
            });
            return !!vendor;
        } catch (error) {
            this.logger.error(`Error during ownership check for user ${userId} and vendor ${vendorId}`, error.stack);
            return false;
        }
    }

    private async invalidateCache(vendorId: string): Promise<void> {
        const cacheKey = `vendor_profile_${vendorId}`;
        this.logger.log(`Invalidating cache for vendor profile ${vendorId}`);
        await this.cacheManager.del(cacheKey);
    }
}