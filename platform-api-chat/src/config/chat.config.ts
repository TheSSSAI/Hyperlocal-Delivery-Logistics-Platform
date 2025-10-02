import { registerAs } from '@nestjs/config';

/**
 * Type-safe configuration for the Chat service.
 * Loaded from environment variables.
 *
 * @see REQ-1-111 for technology stack.
 * @see SDS for configuration specifications.
 */
export default registerAs('chat', () => ({
  orderServiceUrl: process.env.ORDER_SERVICE_URL,
  participantCacheTtlSeconds: parseInt(
    process.env.PARTICIPANT_CACHE_TTL_SECONDS,
    10,
  ) || 300,
}));