import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  ValidationPipe,
  Get,
  Query,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { CreateRatingDto } from './dto/create-rating.dto';
import { IRatingsService } from './interfaces/ratings.service.interface';
import { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { RatingDto } from './dto/rating.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { AllowAny } from '../../common/decorators/allow-any.decorator';

@ApiTags('Ratings')
@ApiBearerAuth()
@Controller('api/v1/ratings')
export class RatingsController {
  private readonly logger = new Logger(RatingsController.name);

  constructor(
    @Inject('IRatingsService')
    private readonly ratingsService: IRatingsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Submit a new rating for a vendor or rider',
    description:
      'Allows an authenticated customer to submit a rating for a completed order. Fulfills REQ-1-063.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The rating has been successfully submitted.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User is not authorized to rate this order.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'A rating for this order has already been submitted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The specified order is not eligible for rating.',
  })
  async submitRating(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createRatingDto: CreateRatingDto,
    @Req() req: Request,
  ): Promise<RatingDto> {
    const user = req.user as AuthenticatedUser;
    this.logger.log(
      `Customer ${user.id} attempting to submit rating for order ${createRatingDto.orderId}`,
    );

    const createdRating = await this.ratingsService.submitRating(
      createRatingDto,
      user,
    );
    this.logger.log(
      `Successfully submitted rating ${createdRating.ratingReviewId} for order ${createRatingDto.orderId}`,
    );
    return createdRating;
  }

  @Get('vendor/:vendorId')
  @AllowAny() // Public endpoint
  @UseGuards(JwtAuthGuard) // Apply JwtAuthGuard but AllowAny will bypass it if no token
  @ApiOperation({
    summary: "Get a vendor's ratings and reviews",
    description:
      "Retrieves a paginated list of public ratings and reviews for a specific vendor. Fulfills part of REQ-1-064.",
  })
  @ApiParam({
    name: 'vendorId',
    type: 'string',
    format: 'uuid',
    description: 'The UUID of the vendor.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A paginated list of vendor ratings.',
    type: PaginatedResult<RatingDto>,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vendor not found.',
  })
  async getVendorRatings(
    @Param('vendorId', ParseUUIDPipe) vendorId: string,
    @Query(new ValidationPipe({ transform: true })) paginationDto: PaginationDto,
  ): Promise<PaginatedResult<RatingDto>> {
    this.logger.log(`Fetching ratings for vendor ${vendorId}`);
    return this.ratingsService.getRatingsForReviewee(
      vendorId,
      'VENDOR',
      paginationDto,
    );
  }

  @Get('rider/:riderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATOR)
  @ApiOperation({
    summary: "Get a rider's ratings and reviews (Admin only)",
    description:
      "Retrieves a paginated list of ratings and reviews for a specific rider. Restricted to administrators. Fulfills part of REQ-1-064.",
  })
  @ApiParam({
    name: 'riderId',
    type: 'string',
    format: 'uuid',
    description: 'The UUID of the rider.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination.' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A paginated list of rider ratings.',
    type: PaginatedResult<RatingDto>,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Rider not found.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Access denied. Administrator role required.',
  })
  async getRiderRatings(
    @Param('riderId', ParseUUIDPipe) riderId: string,
    @Query(new ValidationPipe({ transform: true })) paginationDto: PaginationDto,
  ): Promise<PaginatedResult<RatingDto>> {
    this.logger.log(`Fetching ratings for rider ${riderId} (Admin Request)`);
    return this.ratingsService.getRatingsForReviewee(
      riderId,
      'RIDER',
      paginationDto,
    );
  }

  @Get('averages/vendor/:vendorId')
  @AllowAny()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Get a vendor's average rating",
    description:
      "Retrieves a vendor's calculated average rating and total rating count. Fulfills part of REQ-1-064.",
  })
  @ApiParam({
    name: 'vendorId',
    type: 'string',
    format: 'uuid',
    description: 'The UUID of the vendor.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The average rating and count for the vendor.',
    schema: {
      example: {
        average: 4.5,
        count: 152,
      },
    },
  })
  async getVendorAverageRating(
    @Param('vendorId', ParseUUIDPipe) vendorId: string,
  ): Promise<{ average: number; count: number }> {
    this.logger.log(`Fetching average rating for vendor ${vendorId}`);
    return this.ratingsService.getAverageRatingForReviewee(vendorId, 'VENDOR');
  }

  @Get('averages/rider/:riderId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATOR)
  @ApiOperation({
    summary: "Get a rider's average rating (Admin only)",
    description:
      "Retrieves a rider's calculated average rating and total rating count. Restricted to administrators. Fulfills part of REQ-1-064.",
  })
  @ApiParam({
    name: 'riderId',
    type: 'string',
    format: 'uuid',
    description: 'The UUID of the rider.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The average rating and count for the rider.',
    schema: {
      example: {
        average: 4.8,
        count: 89,
      },
    },
  })
  async getRiderAverageRating(
    @Param('riderId', ParseUUIDPipe) riderId: string,
  ): Promise<{ average: number; count: number }> {
    this.logger.log(
      `Fetching average rating for rider ${riderId} (Admin Request)`,
    );
    return this.ratingsService.getAverageRatingForReviewee(riderId, 'RIDER');
  }
}