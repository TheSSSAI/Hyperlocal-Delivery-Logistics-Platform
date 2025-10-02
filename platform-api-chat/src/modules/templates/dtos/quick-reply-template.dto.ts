import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for a quick-reply template.
 * Defines the public contract for the GET /templates/quick-replies endpoint.
 *
 * @see REQ-1-081 for quick-reply template functionality.
 * @see SDS for DTO specifications.
 */
export class QuickReplyTemplateDto {
  @Expose()
  @ApiProperty({
    example: 'qr-001',
    description: 'Unique identifier for the quick-reply template.',
  })
  id: string;

  @Expose()
  @ApiProperty({
    example: 'I am on my way.',
    description: 'The text content of the quick-reply message.',
  })
  text: string;

  @Expose()
  @ApiProperty({
    example: 'customer-to-rider',
    description:
      'The context in which this template should be displayed (e.g., customer-to-rider, vendor-to-customer).',
  })
  context: string;
}