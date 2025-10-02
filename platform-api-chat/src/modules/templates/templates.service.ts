import { Injectable, Logger } from '@nestjs/common';
import { QuickReplyTemplateDto } from './dtos/quick-reply-template.dto';

@Injectable()
export class TemplatesService {
  private readonly logger = new Logger(TemplatesService.name);
  private readonly templates: Map<string, QuickReplyTemplateDto[]> = new Map();

  constructor() {
    this.loadTemplates();
  }

  private loadTemplates(): void {
    // In a real application, this data would come from a database or a config file.
    // For this implementation, we are hardcoding as per REQ-1-081 and related user stories.

    const customerToVendorTemplates: QuickReplyTemplateDto[] = [
      { id: 'ctv-1', text: 'What is the status of my order?' },
      { id: 'ctv-2', text: 'Can I add an item to my order?' },
      { id: 'ctv-3', text: 'Please make it less spicy.' },
      { id: 'ctv-4', text: 'I have an allergy to peanuts.' },
    ];

    const customerToRiderTemplates: QuickReplyTemplateDto[] = [
      { id: 'ctr-1', text: "I'm at the location." },
      { id: 'ctr-2', text: 'Please leave the order at the door.' },
      { id: 'ctr-3', text: 'Please call me when you arrive.' },
      { id: 'ctr-4', text: 'I am running a few minutes late.' },
    ];

    const vendorToCustomerTemplates: QuickReplyTemplateDto[] = [
      { id: 'vtc-1', text: 'Your order is being prepared.' },
      { id: 'vtc-2', text: 'We are out of an item, can we substitute?' },
      { id: 'vtc-3', text: 'Your order is ready for pickup.' },
      { id: 'vtc-4', text: 'There is a slight delay with your order.' },
    ];

    const riderToCustomerTemplates: QuickReplyTemplateDto[] = [
      { id: 'rtc-1', text: "I'm on my way." },
      { id: 'rtc-2', text: 'I have arrived at your location.' },
      { id: 'rtc-3', text: 'I am stuck in traffic, there is a slight delay.' },
      { id: 'rtc-4', text: 'I am unable to find your address.' },
    ];

    this.templates.set('customer-to-vendor', customerToVendorTemplates);
    this.templates.set('customer-to-rider', customerToRiderTemplates);
    this.templates.set('vendor-to-customer', vendorToCustomerTemplates);
    this.templates.set('rider-to-customer', riderToCustomerTemplates);

    this.logger.log('Quick-reply chat templates loaded.');
  }

  /**
   * Retrieves a list of quick-reply templates based on the communication context.
   * @param context The context, e.g., 'customer-to-rider'.
   * @returns An array of QuickReplyTemplateDto.
   */
  async getTemplatesByContext(
    context: string,
  ): Promise<QuickReplyTemplateDto[]> {
    if (!this.templates.has(context)) {
      this.logger.warn(`No templates found for invalid context: ${context}`);
      return [];
    }
    return this.templates.get(context);
  }
}