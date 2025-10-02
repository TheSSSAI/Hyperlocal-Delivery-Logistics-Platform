import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ContextService } from './context.service';
import {
  CORRELATION_ID_HEADER,
  REQUEST_ID_HEADER,
} from '../constants/headers';

/**
 * Middleware to ensure a correlation ID exists for every incoming request.
 * It checks for 'x-correlation-id' or 'x-request-id' headers. If none are found,
 * it generates a new UUID v4.
 *
 * It uses the ContextService (which leverages AsyncLocalStorage) to store the
 * correlation ID in a request-scoped context, making it available throughout
 * the application without prop-drilling.
 *
 * This is the primary entry point for fulfilling REQ-1-110.
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  constructor(private readonly contextService: ContextService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const correlationId =
      req.headers[CORRELATION_ID_HEADER] ||
      req.headers[REQUEST_ID_HEADER] ||
      uuidv4();

    // Set the correlation ID on the response headers for all outgoing responses.
    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    const store = new Map<string, string>();
    store.set('correlationId', correlationId as string);

    // Run the rest of the request pipeline within the context.
    this.contextService.run(store, () => {
      next();
    });
  }
}