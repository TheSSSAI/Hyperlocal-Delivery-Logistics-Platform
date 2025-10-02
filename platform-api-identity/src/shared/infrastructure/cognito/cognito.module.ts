import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CognitoService } from './cognito.service';

/**
 * @class CognitoModule
 * @description A global module for providing and configuring the Cognito service.
 * It uses a factory provider to instantiate the `CognitoIdentityProviderClient` from the AWS SDK,
 * injecting the `ConfigService` to retrieve necessary configuration like the AWS region.
 * This client is then used by the `CognitoService`, which is provided and exported for
 * application-wide dependency injection. This encapsulates all Cognito-related setup and
 * interaction logic.
 */
@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: CognitoIdentityProviderClient,
      useFactory: (configService: ConfigService) => {
        return new CognitoIdentityProviderClient({
          region: configService.get<string>('AWS_REGION'),
        });
      },
      inject: [ConfigService],
    },
    CognitoService,
  ],
  exports: [CognitoService],
})
export class CognitoModule {}