import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';
import MapboxMatrix from '@mapbox/mapbox-sdk/services/matrix';
import {
  IMapboxService,
  OptimizedRoute,
  DistanceMatrix,
} from './interfaces/mapbox.service.interface';
import { Point } from 'typeorm';

@Injectable()
export class MapboxService implements IMapboxService {
  private readonly logger = new Logger(MapboxService.name);
  private directionsService: ReturnType<typeof MapboxDirections>;
  private matrixService: ReturnType<typeof MapboxMatrix>;

  constructor(private readonly configService: ConfigService) {
    const accessToken = this.configService.get<string>('MAPBOX_API_KEY');
    if (!accessToken) {
      this.logger.error('Mapbox API key is not configured.');
      throw new Error('Mapbox API key is missing.');
    }
    this.directionsService = MapboxDirections({ accessToken });
    this.matrixService = MapboxMatrix({ accessToken });
    this.logger.log('MapboxService initialized.');
  }

  async getOptimizedRoute(
    waypoints: Point[],
    profile: 'driving-traffic' | 'driving' = 'driving-traffic',
  ): Promise<OptimizedRoute> {
    if (waypoints.length < 2) {
      throw new Error('At least two waypoints are required for a route.');
    }

    const coordinates = waypoints.map(
      (p) => `${p.coordinates[0]},${p.coordinates[1]}`,
    );

    this.logger.debug(
      `Requesting optimized route from Mapbox for ${waypoints.length} waypoints.`,
    );

    try {
      const response = await this.directionsService
        .getDirections({
          profile: profile,
          waypoints: coordinates.map((coord) => ({ coordinates: coord.split(',').map(Number) as [number, number] })),
          overview: 'full',
          geometries: 'geojson',
        })
        .send();

      if (response.body.routes && response.body.routes.length > 0) {
        const route = response.body.routes[0];
        const result: OptimizedRoute = {
          distance: route.distance, // in meters
          duration: route.duration, // in seconds
          geometry: route.geometry,
        };
        return result;
      } else {
        throw new Error('Mapbox did not return any routes.');
      }
    } catch (error) {
      this.logger.error(
        `Mapbox getDirections API call failed: ${error.message}`,
        error.stack,
      );
      // Re-throw to be handled by the calling service, which might implement fallbacks
      throw error;
    }
  }

  async getDistanceMatrix(
    sources: Point[],
    destinations: Point[],
    profile: 'driving-traffic' | 'driving' = 'driving-traffic',
  ): Promise<DistanceMatrix> {
    if (sources.length === 0 || destinations.length === 0) {
      throw new Error('Sources and destinations cannot be empty.');
    }

    const allPoints = [...sources, ...destinations];
    const coordinates = allPoints.map((p) => ({
      longitude: p.coordinates[0],
      latitude: p.coordinates[1],
    }));

    const sourceIndices = Array.from({ length: sources.length }, (_, i) => i);
    const destinationIndices = Array.from(
      { length: destinations.length },
      (_, i) => i + sources.length,
    );

    this.logger.debug(
      `Requesting distance matrix from Mapbox for ${sources.length} sources and ${destinations.length} destinations.`,
    );

    try {
      const response = await this.matrixService
        .getMatrix({
          points: coordinates,
          sources: sourceIndices,
          destinations: destinationIndices,
          profile: profile,
        })
        .send();
      
      const body = response.body;

      if (body.durations && body.distances) {
        return {
          durations: body.durations, // seconds
          distances: body.distances, // meters
        };
      } else {
        throw new Error('Mapbox Matrix API did not return durations or distances.');
      }
    } catch (error) {
      this.logger.error(
        `Mapbox getMatrix API call failed: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}