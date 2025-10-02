import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { CreateVendorProfileDto } from './dto/create-vendor-profile.dto';
import { UpdateVendorProfileDto } from './dto/update-vendor-profile.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { VendorOwnershipGuard } from '../../common/guards/vendor-ownership.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UpdateVendorAvailabilityDto } from './dto/vendor-availability.dto';

@ApiTags('vendors')
@ApiBearerAuth()
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a new vendor profile (Admin only)' })
  @ApiResponse({ status: 201, description: 'The vendor has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createVendorDto: CreateVendorProfileDto) {
    // In a real system, this would be part of an admin-facing registration flow
    return this.vendorsService.create(createVendorDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a vendor profile by ID' })
  @ApiResponse({ status: 200, description: 'Returns the vendor profile.' })
  @ApiResponse({ status: 404, description: 'Vendor not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const vendor = await this.vendorsService.findOne(id);
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    return vendor;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, VendorOwnershipGuard)
  @ApiOperation({ summary: 'Update a vendor profile' })
  @ApiResponse({ status: 200, description: 'The vendor profile has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden. You can only update your own profile.' })
  @ApiResponse({ status: 404, description: 'Vendor not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVendorDto: UpdateVendorProfileDto,
  ) {
    return this.vendorsService.update(id, updateVendorDto);
  }

  @Patch(':id/availability')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, VendorOwnershipGuard)
  @ApiOperation({ summary: "Update a vendor's online/offline availability" })
  @ApiResponse({ status: 204, description: 'Availability updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateAvailability(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAvailabilityDto: UpdateVendorAvailabilityDto,
  ) {
    return this.vendorsService.updateAvailability(id, updateAvailabilityDto.isOnline);
  }

  @Get(':id/business-hours')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get a vendor's business hours" })
  @ApiResponse({ status: 200, description: 'Returns the business hours.' })
  @ApiResponse({ status: 404, description: 'Vendor not found.' })
  getBusinessHours(@Param('id', ParseUUIDPipe) id: string) {
    return this.vendorsService.getBusinessHours(id);
  }

  // NOTE: A proper DTO with validation would be used for business hours
  @Patch(':id/business-hours')
  @UseGuards(JwtAuthGuard, VendorOwnershipGuard)
  @ApiOperation({ summary: "Update a vendor's business hours" })
  @ApiResponse({ status: 200, description: 'Business hours updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateBusinessHours(@Param('id', ParseUUIDPipe) id: string, @Body() hours: any) {
    return this.vendorsService.updateBusinessHours(id, hours);
  }
  
  // NOTE: DTOs would be created for License management
  @Post(':id/licenses')
  @UseGuards(JwtAuthGuard, VendorOwnershipGuard)
  @ApiOperation({ summary: "Add a license to a vendor's profile" })
  createLicense(@Param('id', ParseUUIDPipe) id: string, @Body() licenseData: any) {
    return this.vendorsService.addLicense(id, licenseData);
  }

  @Get(':id/licenses')
  @UseGuards(JwtAuthGuard, VendorOwnershipGuard)
  @ApiOperation({ summary: "Get all licenses for a vendor" })
  getLicenses(@Param('id', ParseUUIDPipe) id: string) {
    return this.vendorsService.getLicenses(id);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a vendor profile (Admin only)' })
  @ApiResponse({ status: 204, description: 'The vendor has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.vendorsService.remove(id);
  }
}