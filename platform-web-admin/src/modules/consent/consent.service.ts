import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserConsent } from './entities/user-consent.entity';
import { UpdateConsentDto, ConsentItemDto } from './dto/update-consent.dto';
import { UsersService } from '../users/users.service';
import { EventPublisherService } from '../../shared/infrastructure/messaging/event-publisher.service';
import { UserConsentUpdatedEvent } from './events/user-consent-updated.event';

@Injectable()
export class ConsentService {
  private readonly logger = new Logger(ConsentService.name);

  constructor(
    @InjectRepository(UserConsent)
    private readonly userConsentRepository: Repository<UserConsent>,
    private readonly usersService: UsersService,
    private readonly eventPublisher: EventPublisherService,
  ) {}

  /**
   * Retrieves all consent settings for a specific user.
   * @param userId The ID of the user.
   * @returns A list of UserConsent entities.
   * @throws {NotFoundException} if the user does not exist.
   */
  async getConsentsByUserId(userId: string): Promise<UserConsent[]> {
    // First, ensure the user exists.
    await this.usersService.findById(userId);
    return this.userConsentRepository.find({ where: { user: { id: userId } } });
  }

  /**
   * Updates one or more consent settings for a user.
   * This method performs an "upsert" operation: it updates existing consents
   * and creates new ones if they don't exist.
   * @param userId The ID of the user.
   * @param updateConsentDto The DTO containing the list of consents to update.
   * @returns The updated list of UserConsent entities for the user.
   * @throws {NotFoundException} if the user does not exist.
   */
  async updateConsents(userId: string, updateConsentDto: UpdateConsentDto): Promise<UserConsent[]> {
    const user = await this.usersService.findById(userId);

    const existingConsents = await this.userConsentRepository.find({
      where: { user: { id: userId } },
    });
    
    const existingConsentsMap = new Map(
      existingConsents.map(c => [c.consentType, c]),
    );

    const consentsToSave: UserConsent[] = [];

    for (const consentItem of updateConsentDto.consents) {
      const existingConsent = existingConsentsMap.get(consentItem.consentType);

      if (existingConsent) {
        if (existingConsent.isGranted !== consentItem.isGranted) {
          existingConsent.isGranted = consentItem.isGranted;
          consentsToSave.push(existingConsent);
        }
      } else {
        const newConsent = this.userConsentRepository.create({
          user,
          consentType: consentItem.consentType,
          isGranted: consentItem.isGranted,
        });
        consentsToSave.push(newConsent);
      }
    }

    if (consentsToSave.length > 0) {
      await this.userConsentRepository.save(consentsToSave);
      this.logger.log(`Updated ${consentsToSave.length} consent(s) for user ${userId}`);

      // Publish an event for auditing purposes
      const event = new UserConsentUpdatedEvent(userId, consentsToSave.map(c => ({
          consentType: c.consentType,
          isGranted: c.isGranted,
      })));
      this.eventPublisher.publish('user.consent.updated', event);
    } else {
      this.logger.log(`No consent changes to apply for user ${userId}`);
    }

    // Return the full, updated list of consents
    return this.getConsentsByUserId(userId);
  }
}