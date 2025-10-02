import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/auth/guards/roles.guard';
import { Roles } from 'src/shared/auth/decorators/roles.decorator';
import { Role } from 'src/shared/auth/enums/role.enum';
import { ZonesService } from '../services/zones.service';
import { CreateZoneDto } from '../dtos/create-zone.dto';
import { UpdateZoneDto } from '../dtos/update-zone.dto';
import { Zone } from '../domain/zone.entity';

@ApiTags('Operational Zones')
@ApiBearerAuth()
@Controller('zones')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class ZonesController {
  private readonly logger = new Logger(ZonesController.name);

  constructor(private readonly zonesService: ZonesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new operational zone',
    description: 'Allows an administrator to define a new geofenced operational zone.',
  })
  @ApiResponse({
    status: 201,
    description: 'The operational zone has been successfully created.',
    type: Zone,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data for the zone.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User is not an administrator.' })
  async create(@Body() createZoneDto: CreateZoneDto): Promise<Zone> {
    this.logger.log(`Attempting to create a new zone with name: ${createZoneDto.name}`);
    const newZone = await this.zonesService.create(createZoneDto);
    this.logger.log(`Successfully created zone with ID: ${newZone.id}`);
    return newZone;
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all operational zones',
    description: 'Returns a list of all configured operational zones.',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of all operational zones.',
    type: [Zone],
  })
  @ApiResponse({ status: 403, description: 'Forbidden. User is not an administrator.' })
  async findAll(): Promise<Zone[]> {
    this.logger.log('Fetching all operational zones.');
    return this.zonesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a specific operational zone by ID',
    description: 'Returns the details of a single operational zone.',
  })
  @ApiParam({ name: 'id', description: 'The unique identifier of the zone.' })
  @ApiResponse({
    status: 200,
    description: 'The details of the operational zone.',
    type: Zone,
  })
  @ApiResponse({ status: 404, description: 'Zone with the specified ID not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User is not an administrator.' })
  async findOne(@Param('id') id: string): Promise<Zone> {
    this.logger.log(`Fetching zone with ID: ${id}`);
    return this.zonesService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an existing operational zone',
    description: 'Allows an administrator to update the name, geometry, or status of a zone.',
  })
  @ApiParam({ name: 'id', description: 'The unique identifier of the zone to update.' })
  @ApiResponse({
    status: 200,
    description: 'The operational zone has been successfully updated.',
    type: Zone,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data for the zone update.' })
  @ApiResponse({ status: 404, description: 'Zone with the specified ID not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User is not an administrator.' })
  async update(@Param('id') id: string, @Body() updateZoneDto: UpdateZoneDto): Promise<Zone> {
    this.logger.log(`Attempting to update zone with ID: ${id}`);
    const updatedZone = await this.zonesService.update(id, updateZoneDto);
    this.logger.log(`Successfully updated zone with ID: ${id}`);
    return updatedZone;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete an operational zone',
    description: 'Permanently removes an operational zone from the system.',
  })
  @ApiParam({ name: 'id', description: 'The unique identifier of the zone to delete.' })
  @ApiResponse({
    status: 204,
    description: 'The operational zone has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Zone with the specified ID not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden. User is not an administrator.' })
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Attempting to delete zone with ID: ${id}`);
    await this.zonesService.remove(id);
    this.logger.log(`Successfully deleted zone with ID: ${id}`);
  }
}