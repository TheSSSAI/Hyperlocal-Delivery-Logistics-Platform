import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MetricsService } from './metrics.service';
import { Counter, Histogram } from 'prom-client';
import { Request } from 'express';

/**
 * A NestJS interceptor that automatically records standard HTTP metrics for all endpoints.
 * It tracks request latency and total request counts, labeled by route, method, and status code.
 *
 * This is the primary implementation for fulfilling REQ-1-109, as it provides the
 * key metrics required for alerting on high latency and error rates.
 */
@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private readonly httpRequestsTotal: Counter<string>;
  private readonly httpRequestDurationSeconds: Histogram<string>;

  constructor(private readonly metricsService: MetricsService) {
    // Define and register the core HTTP metrics on initialization.
    this.httpRequestsTotal = this.metricsService.createCounter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    this.httpRequestDurationSeconds = this.metricsService.createHistogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10], // Standard latency buckets
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = process.hrtime();
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        this.recordMetrics(request, response.statusCode, startTime);
      }),
      catchError((error) => {
        const statusCode =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        this.recordMetrics(request, statusCode, startTime);
        return throwError(() => error);
      }),
    );
  }

  private recordMetrics(
    request: Request,
    statusCode: number,
    startTime: [number, number],
  ) {
    // NestJS's request.route is not always available. We build a clean route path.
    const route = request.route ? request.route.path : request.path;
    const method = request.method.toUpperCase();

    const durationInSeconds = this.getDurationInSeconds(startTime);

    const labels = {
      method,
      route,
      status_code: statusCode.toString(),
    };

    this.httpRequestsTotal.inc(labels);
    this.httpRequestDurationSeconds.observe(labels, durationInSeconds);
  }

  private getDurationInSeconds(start: [number, number]): number {
    const end = process.hrtime(start);
    return end[0] + end[1] / 1e9;
  }
}