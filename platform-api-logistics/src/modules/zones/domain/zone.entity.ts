import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Polygon } from 'geojson';

@Entity('operational_zones')
export class Zone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Polygon',
    srid: 4326,
  })
  geometry: Polygon;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  protected constructor() {}

  public static create(name: string, geometry: Polygon, isActive = true): Zone {
    const zone = new Zone();
    zone.name = name;
    zone.geometry = geometry;
    zone.isActive = isActive;
    return zone;
  }

  public updateDetails(name: string, geometry: Polygon): void {
    this.name = name;
    this.geometry = geometry;
  }

  public activate(): void {
    this.isActive = true;
  }

  public deactivate(): void {
    this.isActive = false;
  }
}