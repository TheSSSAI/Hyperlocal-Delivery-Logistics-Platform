import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ConsentService } from './consent.service';
import { UpdateConsentDto } from './dto/update-consent.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/dto/jwt-payload.interface';
import { UserConsent } from './entities/user-consent.entity';

@ApiTags('User Consent')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('consent')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Get('me')
  @ApiOperation({ summary: "Get the current user's consent settings" })
  @ApiResponse({
    status: 200,
    description: "Successfully retrieved the user's consent settings.",
    type: [UserConsent],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getConsents(@CurrentUser() user: JwtPayload): Promise<UserConsent[]> {
    // REQ-1-021: Provide a mechanism for users to view and manage their given consents.
    // CUS-042: Customer Manages Granular Data Consent Settings.
    return this.consentService.getConsents(user.userId);
  }

  @Put('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update the current user's consent settings" })
  @ApiBody({ type: UpdateConsentDto })
  @ApiResponse({
    status: 200,
    description: "Successfully updated the user's consent settings.",
    type: [UserConsent],
  })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  updateConsents(
    @CurrentUser() user: JwtPayload,
    @Body() updateConsentDto: UpdateConsentDto,
  ): Promise<UserConsent[]> {
    // REQ-1-021: Provide a mechanism for users to view and manage their given consents.
    // CUS-042: Customer Manages Granular Data Consent Settings.
    return this.consentService.updateConsents(user.userId, updateConsentDto);
  }
}