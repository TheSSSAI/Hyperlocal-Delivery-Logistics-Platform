import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ConsentService } from './consent.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateConsentDto } from './dto/update-consent.dto';
import { UserConsent } from './entities/user-consent.entity';

@ApiTags('Consent')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('consent')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Get()
  @ApiOperation({ summary: "Get the current user's consent settings" })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of consent settings for the user.',
    type: [UserConsent],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getUserConsents(@Request() req): Promise<UserConsent[]> {
    const userId = req.user.id;
    return this.consentService.getUserConsents(userId);
  }

  @Put()
  @ApiOperation({ summary: "Update the current user's consent settings" })
  @ApiResponse({
    status: 200,
    description: 'Consent settings updated successfully.',
    type: [UserConsent],
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  updateUserConsents(
    @Request() req,
    @Body() updateConsentDto: UpdateConsentDto,
  ): Promise<UserConsent[]> {
    const userId = req.user.id;
    return this.consentService.updateUserConsents(userId, updateConsentDto);
  }
}