import { registerAs } from '@nestjs/config';

export const LOGISTICS_CONFIG_NAMESPACE = 'logistics';

export interface LogisticsConfig {
  mapbox: {
    apiKey: string;
  };
  allocation: {
    maxAttempts: number;
    timeoutMinutes: number;
    riderAcceptanceTimeoutSeconds: number;
  };
}

export default registerAs(
  LOGISTICS_CONFIG_NAMESPACE,
  (): LogisticsConfig => ({
    mapbox: {
      apiKey: process.env.MAPBOX_API_KEY || '',
    },
    allocation: {
      // REQ-1-079: The process shall be repeated up to a maximum of 3 attempts over a 5-minute period.
      maxAttempts: parseInt(process.env.ALLOCATION_MAX_ATTEMPTS, 10) || 3,
      timeoutMinutes:
        parseInt(process.env.ALLOCATION_TIMEOUT_MINUTES, 10) || 5,
      // REQ-1-071: The rider must be given 'Accept' and 'Reject' options and a configurable time limit (default: 60 seconds) to respond.
      riderAcceptanceTimeoutSeconds:
        parseInt(process.env.RIDER_ACCEPTANCE_TIMEOUT_SECONDS, 10) || 60,
    },
  }),
);