import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// Basic GeoJSON validation for the DTO layer.
// More robust validation would occur at the service/database layer with PostGIS.
class GeoJsonPolygonCoordinates {
  @IsArray()
  @IsArray({ each: true })
  coordinates: number[][][]; // Array of linear rings
}

class GeoJsonPolygonDto {
  @IsString()
  @IsNotEmpty()
  type: 'Polygon';

  @ValidateNested()
  @Type(() => GeoJsonPolygonCoordinates)
  coordinates: GeoJsonPolygonCoordinates;
}

/**
 * REQ-1-080: Data Transfer Object for creating a new operational zone via the admin dashboard.
 */
export class CreateZoneDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @ValidateNested()
  @Type(() => GeoJsonPolygonDto)
  geoJson: GeoJsonPolygonDto;
}