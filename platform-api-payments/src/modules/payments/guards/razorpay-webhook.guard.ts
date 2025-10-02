import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { RazorpayService } from '../../../shared/razorpay/razorpay.service';

/**
 * A NestJS Guard to protect webhook endpoints by validating the
 * 'x-razorpay-signature' header.
 *
 * This guard relies on a middleware to be configured globally that
 * provides the raw request body. The standard NestJS body parser
 * consumes the stream and makes the raw body unavailable, which
 * invalidates signature verification.
 *
 * Example middleware (in main.ts):
 * app.use(json({
 *   verify: (req: any, res, buf) => {
 *     req.rawBody = buf;
 *   }
 * }));
 */
@Injectable()
export class RazorpayWebhookGuard implements CanActivate {
  private readonly logger = new Logger(RazorpayWebhookGuard.name);

  constructor(private readonly razorpayService: RazorpayService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { rawBody?: Buffer }>();

    const signature = request.headers['x-razorpay-signature'] as string;
    if (!signature) {
      this.logger.warn('Webhook request rejected: Missing x-razorpay-signature header.');
      throw new BadRequestException('Missing Razorpay signature header.');
    }

    // The rawBody is expected to be a Buffer attached by a middleware.
    // Razorpay's validation function requires a string.
    const rawBody = request.rawBody?.toString();
    if (!rawBody) {
      this.logger.error(
        'Webhook guard error: Raw request body is not available. Ensure a rawBody middleware is configured.',
      );
      // We throw a BadRequestException because this is a server configuration issue,
      // not a client-side (Razorpay) error.
      throw new BadRequestException('Server configuration error: Raw body not available for signature validation.');
    }

    const isSignatureValid = this.razorpayService.validateWebhookSignature(rawBody, signature);

    if (!isSignatureValid) {
      this.logger.warn(`Webhook request rejected: Invalid signature.`);
      throw new UnauthorizedException('Invalid Razorpay webhook signature.');
    }

    this.logger.log('Webhook request authorized: Valid signature.');
    return true;
  }
}