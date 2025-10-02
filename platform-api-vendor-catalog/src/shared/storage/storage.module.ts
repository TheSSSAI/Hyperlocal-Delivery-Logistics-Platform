import { Global, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

export const S3_CLIENT = 'S3_CLIENT';

const s3ClientProvider: Provider = {
  provide: S3_CLIENT,
  useFactory: (configService: ConfigService): S3Client => {
    return new S3Client({
      region: configService.get<string>('AWS_S3_REGION'),
      credentials: {
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      },
      // In production, you might configure an endpoint for services like MinIO
      // endpoint: configService.get<string>('AWS_S3_ENDPOINT'),
    });
  },
  inject: [ConfigService],
};

@Global()
@Module({
  providers: [s3ClientProvider],
  exports: [s3ClientProvider],
})
export class StorageModule {}