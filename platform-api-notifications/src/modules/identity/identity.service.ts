import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { AxiosError } from 'axios';
import { UserContactDetailsDto } from './dtos/user-contact-details.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class IdentityService {
  private readonly logger = new Logger(IdentityService.name);
  private readonly identityServiceBaseUrl: string;
  private readonly requestTimeout: number = 3000; // 3 seconds timeout for internal service calls

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.identityServiceBaseUrl = this.configService.get<string>('identityService.baseUrl');
    if (!this.identityServiceBaseUrl) {
      throw new Error('Identity service base URL is not configured.');
    }
    this.logger.log(`IdentityService initialized with base URL: ${this.identityServiceBaseUrl}`);
  }

  /**
   * Fetches the contact details (mobile number, device tokens) for a given user ID
   * from the internal Identity & Access microservice.
   * @param userId The unique identifier of the user.
   * @returns A promise that resolves to UserContactDetailsDto or null if the user is not found.
   * @throws HttpException for server errors or timeouts.
   */
  async getContactDetails(userId: string): Promise<UserContactDetailsDto | null> {
    const url = `${this.identityServiceBaseUrl}/internal/users/${userId}/contact-details`;
    this.logger.log(`Fetching contact details for userId: ${userId} from ${url}`);

    try {
      const { data } = await firstValueFrom(
        this.httpService.get<any>(url).pipe(
          timeout(this.requestTimeout),
          catchError((error: AxiosError) => {
            if (error.response?.status === HttpStatus.NOT_FOUND) {
              // Return null if user not found, which is a valid business case
              return [null];
            }
            // For other errors, re-throw as a NestJS HttpException
            const statusCode = error.response?.status || HttpStatus.SERVICE_UNAVAILABLE;
            const message = `Error fetching contact details from Identity service for userId ${userId}`;
            this.logger.error(message, error.stack);
            throw new HttpException(message, statusCode);
          }),
        ),
      );

      if (!data) {
        this.logger.warn(`User with ID ${userId} not found in Identity service.`);
        return null;
      }

      // Validate and transform the plain object to a class instance
      const contactDetails = plainToInstance(UserContactDetailsDto, data, {
        excludeExtraneousValues: true,
      });

      this.logger.log(`Successfully fetched contact details for userId: ${userId}`);
      return contactDetails;

    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Re-throw HttpException from the catchError block
      }
      this.logger.error(`Unhandled exception while fetching contact details for userId ${userId}`, error.stack);
      throw new HttpException(
        'An unexpected error occurred while communicating with the Identity service.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}