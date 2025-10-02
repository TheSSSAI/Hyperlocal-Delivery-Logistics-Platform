import { Controller, Get, Res } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { Response } from 'express';
import { register } from 'prom-client';

/**
 * Exposes a '/metrics' endpoint for Prometheus to scrape.
 * This is a core part of fulfilling REQ-1-108.
 *
 * It is unauthenticated by convention, as Prometheus scrapers typically do not
 * handle complex authentication schemes. Network policies should be used to
 * restrict access to this endpoint in production.
 */
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async getMetrics(@Res() res: Response): Promise<void> {
    res.set('Content-Type', register.contentType);
    const metrics = await this.metricsService.getMetrics();
    res.end(metrics);
  }
}