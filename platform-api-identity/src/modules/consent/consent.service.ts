import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserConsent } from './entities/user-consent.entity';
import { UpdateConsentDto } from './dto/update-consent.dto';
import { UserRepository } from '../users/repositories/user.repository';
// Assuming an AuditLogRepository is available for logging consent changes.
// For now, we will just log to the standard logger.

@Injectable()
export class ConsentService {
  private readonly logger = new Logger(ConsentService.name);

  constructor(
    @InjectRepository(UserConsent)
    private readonly userConsentRepository: Repository<UserConsent>,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Retrieves all consent settings for a given user.
   * @param userId - The ID of the user.
   * @returns An array of UserConsent entities.
   */
  async getUserConsents(userId: string): Promise<UserConsent[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    return this.userConsentRepository.find({
      where: { user: { id: userId } },
    });
  }

  /**
   * Updates the consent settings for a given user.
   * @param userId - The ID of the user.
   * @param updateConsentDto - The DTO containing the consent updates.
   * @returns The updated array of UserConsent entities.
   */
  async updateUserConsents(userId: string, updateConsentDto: UpdateConsentDto[]): Promise<UserConsent[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const existingConsents = await this.getUserConsents(userId);
    const consentsToUpdate: UserConsent[] = [];

    for (const consentUpdate of updateConsentDto) {
      // In a real application, we would validate consent types against a predefined list
      // and check which ones are mandatory. For now, we assume all are optional.
      const { consentType, isGranted } = consentUpdate;

      let consent = existingConsents.find(c => c.consentType === consentType);

      if (consent) {
        // Update existing consent
        if (consent.isGranted !== isGranted) {
          consent.isGranted = isGranted;
          consentsToUpdate.push(consent);
          this.logger.log(`Updating consent for user ${userId}: ${consentType} set to ${isGranted}`);
          // Here we would call an AuditLogService to record the change.
          // auditLogService.logConsentChange(userId, consentType, isGranted);
        }
      } else {
        // Create new consent
        consent = this.userConsentRepository.create({
          user,
          consentType,
          isGranted,
        });
        consentsToUpdate.push(consent);
        this.logger.log(`Creating consent for user ${userId}: ${consentType} set to ${isGranted}`);
        // Audit log call would also go here.
      }
    }
    
    if (consentsToUpdate.length === 0) {
        this.logger.log(`No consent changes to apply for user ${userId}`);
        return existingConsents;
    }

    try {
      await this.userConsentRepository.save(consentsToUpdate);
      this.logger.log(`Successfully updated consents for user ${userId}`);
      return this.getUserConsents(userId); // Return the full updated list
    } catch (error) {
      this.logger.error(`Failed to update consents for user ${userId}`, error.stack);
      throw new BadRequestException('Failed to update consent settings.');
    }
  }

  /**
   * Saves initial consents for a new user.
   * This is intended to be called transactionally during user registration.
   * @param user - The newly created User entity.
   * @param initialConsents - The initial consent settings.
   * @param manager - The TypeORM EntityManager for the transaction.
   */
  async saveInitialConsents(user: any, initialConsents: UpdateConsentDto[], manager: any): Promise<void> {
    if (!initialConsents || initialConsents.length === 0) {
      return;
    }

    const consentEntities = initialConsents.map(consentDto => {
      return this.userConsentRepository.create({
        user,
        consentType: consentDto.consentType,
        isGranted: consentDto.isGranted,
      });
    });

    await manager.save(consentEntities);
    this.logger.log(`Initial consents saved for new user ${user.id}`);
  }
}