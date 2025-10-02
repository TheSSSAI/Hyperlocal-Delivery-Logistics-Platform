import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CsvImportJobData } from './interfaces/csv-import-job-data.interface';
import { Job } from 'bull';

@Injectable()
export class BulkImportService {
  private readonly logger = new Logger(BulkImportService.name);

  constructor(
    @InjectQueue('csv-import-queue') private readonly csvImportQueue: Queue,
  ) {}

  /**
   * Enqueues a new CSV import job for asynchronous processing.
   * This method is called by the controller after a file has been uploaded to S3.
   * @param vendorId - The ID of the vendor who initiated the import.
   * @param s3FileKey - The key of the uploaded CSV file in the S3 bucket.
   * @param originalFileName - The original name of the uploaded file for notifications.
   * @returns A promise that resolves to the queued job object.
   */
  async startCsvImportJob(
    vendorId: string,
    s3FileKey: string,
    originalFileName: string,
  ): Promise<Job<CsvImportJobData>> {
    this.logger.log(
      `Enqueuing CSV import job for vendor ${vendorId} with file key ${s3FileKey}`,
    );

    const jobData: CsvImportJobData = {
      vendorId,
      s3FileKey,
      originalFileName,
    };

    const job = await this.csvImportQueue.add('import-product-catalog', jobData, {
      attempts: 3, // Retry up to 3 times on failure
      backoff: {
        type: 'exponential',
        delay: 5000, // 5 seconds first delay
      },
    });

    this.logger.log(
      `Job ${job.id} for vendor ${vendorId} successfully enqueued.`,
    );
    return job;
  }

  /**
   * Retrieves the status of a specific import job.
   * @param jobId - The ID of the job to check.
   * @returns A promise that resolves to the job object, which includes its status.
   */
  async getJobStatus(jobId: string | number): Promise<Job<CsvImportJobData>> {
    const job = await this.csvImportQueue.getJob(jobId);
    if (!job) {
      this.logger.warn(`Attempted to get status for non-existent job ID: ${jobId}`);
      return null;
    }
    return job;
  }
}