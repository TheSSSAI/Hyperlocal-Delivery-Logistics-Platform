import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IZoneRepository } from '../interfaces/zone.repository.interface';
import { Zone } from '../domain/zone.entity';
import { CreateZoneDto } from '../dtos/create-zone.dto';

@Injectable()
export class ZoneRepository implements IZoneRepository {
  private readonly logger = new Logger(ZoneRepository.name);

  constructor(
    @InjectRepository(Zone)
    private readonly zoneRepository: Repository<Zone>,
  ) {}

  async create(createZoneDto: CreateZoneDto): Promise<Zone> {
    this.logger.log(`Creating a new zone with name: ${createZoneDto.name}`);
    try {
      const zone = this.zoneRepository.create({
        name: createZoneDto.name,
        // The geoJson is expected to be a GeoJSON Polygon object.
        // PostGIS will store this in the geography column.
        geometry: createZoneDto.geoJson,
        isActive: createZoneDto.isActive ?? true,
      });
      return await this.zoneRepository.save(zone);
    } catch (error) {
      this.logger.error(`Failed to create zone: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Zone[]> {
    this.logger.log('Finding all zones');
    try {
      return await this.zoneRepository.find();
    } catch (error) {
      this.logger.error(
        `Failed to find all zones: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findById(id: string): Promise<Zone | null> {
    this.logger.log(`Finding zone by id: ${id}`);
    try {
      return await this.zoneRepository.findOneBy({ id });
    } catch (error) {
      this.logger.error(
        `Failed to find zone by id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: string, zone: Partial<Zone>): Promise<Zone | null> {
    this.logger.log(`Updating zone with id: ${id}`);
    try {
      await this.zoneRepository.update(id, zone);
      return this.findById(id);
    } catch (error) {
      this.logger.error(
        `Failed to update zone ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    this.logger.log(`Deleting zone with id: ${id}`);
    try {
      const result = await this.zoneRepository.delete(id);
      return result.affected > 0;
    } catch (error) {
      this.logger.error(
        `Failed to delete zone ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async isPointInAnyActiveZone(point: {
    latitude: number;
    longitude: number;
  }): Promise<boolean> {
    this.logger.log(
      `Checking if point (lat: ${point.latitude}, lon: ${point.longitude}) is in any active zone.`,
    );
    try {
      // This query uses PostGIS's ST_Contains function to perform an efficient geospatial check.
      // The point is created from longitude and latitude, and SRID 4326 is used for WGS 84.
      // A GIST index on the 'geometry' column is crucial for performance.
      const query = `
        SELECT EXISTS (
          SELECT 1
          FROM operational_zones
          WHERE "isActive" = true
          AND ST_Contains(geometry, ST_SetSRID(ST_MakePoint($1, $2), 4326))
        ) as "exists";
      `;

      const result = await this.zoneRepository.query(query, [
        point.longitude,
        point.latitude,
      ]);

      return result[0]?.exists || false;
    } catch (error) {
      this.logger.error(
        `Failed to perform point-in-zone check: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}