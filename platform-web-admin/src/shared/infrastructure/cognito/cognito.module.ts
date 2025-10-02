import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CognitoService } from './cognito.service';

/**
 * Provides and exports the CognitoService as a global singleton.
 * This makes the service available throughout the application without
 * needing to import CognitoModule in every feature module.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [CognitoService],
  exports: [CognitoService],
})
export class CognitoModule {}