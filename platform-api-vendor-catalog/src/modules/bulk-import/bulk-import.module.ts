import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BulkImportService } from './bulk-import.service';
import { BulkImportController } from './bulk-import.controller';
import { CsvImportProcessor } from './processors/csv-import.processor';
import { StorageModule } from 'src/shared/storage/storage.module';
import { ProductsModule } from '../products/products.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { ConfigModule } from '@nestjs/config';
import { CSV_IMPORT_QUEUE } from 'src/common/constants/queue.constants';

/**
 * @module BulkImportModule
 * @description Feature module that encapsulates all logic for bulk importing
 * product catalogs via CSV files. It demonstrates a complete asynchronous
 * workflow, integrating with file storage, background job queues, core
 * business logic services, and real-time notification gateways.
 */
@Module({
  imports: [
    ConfigModule,
    // Register the Bull queue for CSV import jobs
    BullModule.registerQueue({
      name: CSV_IMPORT_QUEUE,
    }),
    // Import modules whose services are needed
    StorageModule,
    ProductsModule,
    NotificationsModule,
  ],
  controllers: [BulkImportController],
  providers: [BulkImportService, CsvImportProcessor],
})
export class BulkImportModule {}