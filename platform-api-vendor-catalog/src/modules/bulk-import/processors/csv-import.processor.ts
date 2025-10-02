import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { CsvImportJobData } from '../interfaces/csv-import-job-data.interface';
import { StorageService } from '../../../shared/storage/storage.service';
import { ProductsService } from '../../products/products.service';
import { NotificationsGateway } from '../../notifications/notifications.gateway';
import * as csv from 'csv-parse';
import { Readable } from 'stream';
import { CreateProductDto } from '../../products/dto/create-product.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Processor('csv-import-queue')
export class CsvImportProcessor {
  private readonly logger = new Logger(CsvImportProcessor.name);

  constructor(
    private readonly storageService: StorageService,
    private readonly productsService: ProductsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  @Process('import-product-catalog')
  async handleCsvImport(job: Job<CsvImportJobData>): Promise<any> {
    const { vendorId, s3FileKey, originalFileName } = job.data;
    this.logger.log(`Processing job ${job.id} for vendor ${vendorId}, file: ${s3FileKey}`);

    const fileStream = await this.storageService.getFileStream(s3FileKey);
    const parser = fileStream.pipe(csv.parse({ columns: true, trim: true, skip_empty_lines: true }));
    
    let createdCount = 0;
    let updatedCount = 0;
    const errors: { row: any; error: string }[] = [];
    let rowNumber = 1;

    try {
      for await (const row of parser) {
        rowNumber++;
        const productDto = plainToInstance(CreateProductDto, {
            ...row,
            price: parseFloat(row.price),
            stockQuantity: parseInt(row.stockQuantity, 10),
        });

        const validationErrors = await validate(productDto);
        if (validationErrors.length > 0) {
          const errorMessages = validationErrors
            .map((err) => Object.values(err.constraints))
            .join('; ');
          errors.push({ row, error: errorMessages });
          continue;
        }

        try {
            // Using a single service method to handle both creation and update logic
            // Assuming `createOrUpdateProduct` returns a boolean indicating if it was an update
          const wasUpdated = await this.productsService.createOrUpdateProduct(vendorId, productDto);
          if (wasUpdated) {
            updatedCount++;
          } else {
            createdCount++;
          }
        } catch (error) {
          this.logger.warn(`Error processing row ${rowNumber} for job ${job.id}: ${error.message}`);
          errors.push({ row, error: error.message || 'Failed to save product.' });
        }
      }

      let reportUrl = null;
      if (errors.length > 0) {
        reportUrl = await this.generateAndUploadErrorReport(errors, vendorId, originalFileName);
      }

      const result = {
        jobId: job.id,
        status: errors.length > 0 ? 'completed_with_errors' : 'success',
        message: `Import complete. ${createdCount} products created, ${updatedCount} updated, ${errors.length} failed.`,
        created: createdCount,
        updated: updatedCount,
        failed: errors.length,
        reportUrl: reportUrl,
        originalFileName,
      };

      this.notificationsGateway.sendJobCompletionNotification(vendorId, result);
      this.logger.log(`Job ${job.id} completed. ${result.message}`);
      return result;

    } catch (error) {
      this.logger.error(`Fatal error processing job ${job.id}: ${error.message}`, error.stack);
      const result = {
        jobId: job.id,
        status: 'failed',
        message: 'A fatal error occurred during processing. Please check the file format and try again.',
        originalFileName,
      };
      this.notificationsGateway.sendJobCompletionNotification(vendorId, result);
      throw error; // Re-throw to make Bull mark the job as failed
    } finally {
        // Clean up original uploaded file after processing
        await this.storageService.deleteFile(s3FileKey);
    }
  }

  private async generateAndUploadErrorReport(
    errors: { row: any; error: string }[],
    vendorId: string,
    originalFileName: string,
  ): Promise<string> {
    this.logger.log(`Generating error report for vendor ${vendorId}`);
    if (errors.length === 0) return null;

    const headers = Object.keys(errors[0].row);
    const csvRows = [
      [...headers, 'Error_Description'].join(','),
      ...errors.map(({ row, error }) => {
        const values = headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`);
        const errorValue = `"${error.replace(/"/g, '""')}"`;
        return [...values, errorValue].join(',');
      }),
    ];
    
    const csvContent = csvRows.join('\n');
    const buffer = Buffer.from(csvContent, 'utf-8');
    
    const reportKey = `imports/errors/${vendorId}/${Date.now()}-error-report-${originalFileName}`;

    await this.storageService.uploadFile(reportKey, buffer, 'text/csv');
    const downloadUrl = await this.storageService.getSignedDownloadUrl(reportKey, 60 * 60 * 24); // 24-hour expiry

    this.logger.log(`Error report uploaded to ${reportKey} for vendor ${vendorId}`);
    return downloadUrl;
  }
}