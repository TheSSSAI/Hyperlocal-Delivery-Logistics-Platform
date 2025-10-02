import { Controller, Get, Query, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { TemplatesService } from './templates.service';
import { QuickReplyTemplateDto } from './dtos/quick-reply-template.dto';

@ApiTags('Templates')
@ApiBearerAuth()
@Controller('templates')
@UseGuards(AuthGuard('jwt'))
export class TemplatesController {
  private readonly logger = new Logger(TemplatesController.name);

  constructor(private readonly templatesService: TemplatesService) {}

  @Get('quick-replies')
  @ApiOperation({
    summary: 'Get Quick Reply Templates',
    description:
      'Fetches a list of predefined quick-reply message templates based on the communication context.',
  })
  @ApiQuery({
    name: 'context',
    required: true,
    description:
      'The context for which to fetch templates (e.g., "customer-to-rider", "vendor-to-customer").',
    enum: ['customer-to-rider', 'customer-to-vendor', 'vendor-to-customer', 'rider-to-customer'],
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved quick reply templates.',
    type: [QuickReplyTemplateDto],
  })
  @ApiResponse({ status: 400, description: 'Bad Request. Invalid context provided.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getQuickReplyTemplates(
    @Query('context') context: string,
  ): Promise<QuickReplyTemplateDto[]> {
    this.logger.log(`Fetching quick reply templates for context: ${context}`);
    // In a real application, you'd have more robust validation on the context enum.
    // For now, we delegate to the service.
    const templates = await this.templatesService.getTemplatesByContext(context);
    this.logger.log(`Found ${templates.length} templates for context: ${context}`);
    return templates;
  }
}