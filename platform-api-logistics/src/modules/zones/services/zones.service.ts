import { Injectable, Inject, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { IZoneRepository } from '../interfaces/zone.repository.interface';
import { CreateZoneDto } from '../dtos/create-zone.dto';
import { Zone } from '../domain/zone.entity';
import { Feature, Polygon } from 'geojson';

@Injectable()
export class ZonesService {
  private readonly logger = new Logger(ZonesService.name);

  constructor(
    @Inject('IZoneRepository')
    private readonly zoneRepository: IZoneRepository,
  ) {}

  /**
   * Creates a new operational zone.
   * @param createZoneDto - The data for the new zone.
   * @returns The created Zone entity.
   * @throws ConflictException if a zone with the same name already exists.
   */
  async createZone(createZoneDto: CreateZoneDto): Promise<Zone> {
    this.logger.log(`Attempting to create a new zone with name: ${createZoneDto.name}`);

    const existingZone = await this.zoneRepository.findByName(createZoneDto.name);
    if (existingZone) {
      throw new ConflictException(`A zone with the name '${createZone-dto.name}' already exists.`);
    }

    const zone = new Zone();
    zone.name = createZoneDto.name;
    zone.isActive = createZoneDto.isActive ?? true;

    // Assuming DTO contains a valid GeoJSON Feature with a Polygon geometry
    const geoJsonFeature = createZoneDto.geoJson as Feature<Polygon>;
    zone.geometry = {
        type: 'Polygon',
        coordinates: geoJsonFeature.geometry.coordinates,
    };
    
    const newZone = await this.zoneRepository.create(zone);
    this.logger.log(`Successfully created zone with ID: ${newZone.id}`);
    return newZone;
  }

  /**
   * Finds all operational zones.
   * @returns A list of all Zone entities.
   */
  async findAll(): Promise<Zone[]> {
    this.logger.log('Fetching all operational zones.');
    return this.zoneRepository.findAll();
  }

  /**
   * Finds a single operational zone by its ID.
   * @param id - The ID of the zone.
   * @returns The Zone entity.
   * @throws NotFoundException if the zone does not exist.
   */
  async findOne(id: string): Promise<Zone> {
    this.logger.log(`Fetching zone with ID: ${id}`);
    const zone = await this.zoneRepository.findById(id);
    if (!zone) {
      throw new NotFoundException(`Zone with ID ${id} not found.`);
    }
    return zone;
  }

  /**
   * Updates an existing operational zone.
   * @param id - The ID of the zone to update.
   * @param updateZoneDto - The new data for the zone.
   * @returns The updated Zone entity.
   * @throws NotFoundException if the zone does not exist.
   */
  async updateZone(id: string, updateZoneDto: Partial<CreateZoneDto>): Promise<Zone> {
    this.logger.log(`Updating zone with ID: ${id}`);
    const zoneToUpdate = await this.findOne(id);

    if (updateZoneDto.name && updateZoneDto.name !== zoneToUpdate.name) {
      const existingZone = await this.zoneRepository.findByName(updateZoneDto.name);
      if (existingZone && existingZone.id !== id) {
        throw new ConflictException(`A zone with the name '${updateZoneDto.name}' already exists.`);
      }
      zoneToUpdate.name = updateZoneDto.name;
    }
    
    if (updateZoneDto.isActive !== undefined) {
      zoneToUpdate.isActive = updateZoneDto.isActive;
    }

    if (updateZoneDto.geoJson) {
      const geoJsonFeature = updateZoneDto.geoJson as Feature<Polygon>;
      zoneToUpdate.geometry = {
          type: 'Polygon',
          coordinates: geoJsonFeature.geometry.coordinates,
      };
    }

    const updatedZone = await this.zoneRepository.update(id, zoneToUpdate);
    this.logger.log(`Successfully updated zone with ID: ${id}`);
    return updatedZone;
  }

  /**
   * Deletes an operational zone.
   * @param id - The ID of the zone to delete.
   * @throws NotFoundException if the zone does not exist.
   */
  async deleteZone(id: string): Promise<void> {
    this.logger.log(`Attempting to delete zone with ID: ${id}`);
    const zone = await this.findOne(id);
    await this.zoneRepository.delete(zone.id);
    this.logger.log(`Successfully deleted zone with ID: ${id}`);
  }

  /**
   * Checks if a given geographic point is within any active operational zone.
   * @param point - The latitude and longitude to check.
   * @returns True if the point is in an active zone, otherwise false.
   */
  async isAddressInActiveZone(point: { latitude: number; longitude: number }): Promise<boolean> {
    this.logger.debug(`Checking if point (${point.latitude}, ${point.longitude}) is in an active zone.`);
    const result = await this.zoneRepository.isPointInAnyActiveZone(point);
    this.logger.debug(`Zone check result for point (${point.latitude}, ${point.longitude}): ${result}`);
    return result;
  }
}