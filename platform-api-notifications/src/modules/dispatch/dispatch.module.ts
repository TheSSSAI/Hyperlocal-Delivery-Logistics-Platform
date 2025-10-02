import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SnsClient } from '@aws-sdk/client-sns';
import * as admin from 'firebase-admin';

import { DispatchService } from './services/dispatch.service';
import { FcmService } from './services/fcm.service';
import { SnsService } from './services/sns.service';
import { IdentityModule } from '../identity/identity.module';
import { TemplatesModule } from '../templates/templates.module';
import { IFcmService } from './interfaces/fcm-service.interface';
import { ISnsService } from './interfaces/sns-service.interface';

@Module({
  imports: [IdentityModule, TemplatesModule],
  providers: [
    DispatchService,
    {
      provide: IFcmService,
      useClass: FcmService,
    },
    {
      provide: ISnsService,
      useClass: SnsService,
    },
    {
      provide: 'FirebaseAdmin',
      useFactory: (configService: ConfigService) => {
        const firebaseConfig = configService.get('firebase');

        if (admin.apps.length > 0) {
          return admin.app();
        }

        return admin.initializeApp({
          credential: admin.credential.cert({
            projectId: firebaseConfig.projectId,
            privateKey: firebaseConfig.privateKey.replace(/\\n/g, '\n'), // Handle escaped newlines in env vars
            clientEmail: firebaseConfig.clientEmail,
          }),
        });
      },
      inject: [ConfigService],
    },
    {
      provide: SnsClient,
      useFactory: (configService: ConfigService) => {
        return new SnsClient({
          region: configService.get('aws.region'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DispatchService],
})
export class DispatchModule {}