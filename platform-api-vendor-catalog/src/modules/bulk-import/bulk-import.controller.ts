import {
  Controller,
  Post,
  Param,
  UseGuards,
  Request,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { VendorOwnershipGuard } from 'src/common/guards/vendor-ownership.guard';
import { BulkImportService } from './bulk-import.service';
import { InitiateImportResponseDto } from './dto/initiate-import-response.dto';
import { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';

@ApiTags('Bulk Import')
@ApiBearerAuth()
@Controller('vendors/:vendorId/catalog/import')
@UseGuards(JwtAuthGuard, VendorOwnershipGuard)
export class BulkImportController {
  constructor(private readonly bulkImportService: BulkImportService) {}

  @Post('initiate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Initiate a bulk product import from a CSV file.',
    description:
      "Generates a pre-signed S3 URL for the client to upload a CSV file. Returns the URL and a job ID to track the import process. This aligns with user story VND-013's requirement for a secure upload mechanism.",
  })
  @ApiParam({
    name: 'vendorId',
    type: 'string',
    format: 'uuid',
    description: 'The unique identifier of the vendor.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Successfully generated a pre-signed URL for CSV upload and initiated a tracking job.',
    type: InitiateImportResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. User does not have access to this vendor.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async initiateBulkImport(
    @Param('vendorId', ParseUUIDPipe) vendorId: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<InitiateImportResponseDto> {
    // The VendorOwnershipGuard has already verified that req.user.vendorId matches the vendorId from the URL parameter.
    // The service layer only needs the vendorId to proceed.
    return this.bulkImportService.initiateImport(vendorId);
  }
}