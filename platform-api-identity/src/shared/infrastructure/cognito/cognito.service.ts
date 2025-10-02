import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminInitiateAuthCommand,
  AdminRespondToAuthChallengeCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
  AttributeType,
  AdminUserGlobalSignOutCommand,
  UserNotFoundException,
  UsernameExistsException,
  NotAuthorizedException,
} from '@aws-sdk/client-cognito-identity-provider';
import { UserType } from 'src/modules/users/entities/user-type.enum';
import { TokensDto } from 'src/modules/auth/dto/tokens.dto';

@Injectable()
export class CognitoService {
  private readonly logger = new Logger(CognitoService.name);
  private readonly cognitoClient: CognitoIdentityProviderClient;
  private readonly userPoolId: string;
  private readonly clientId: string;

  constructor(private readonly configService: ConfigService) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.configService.get<string>('aws.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('aws.accessKeyId'),
        secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
      },
    });
    this.userPoolId = this.configService.get<string>('aws.cognito.userPoolId');
    this.clientId = this.configService.get<string>('aws.cognito.clientId');
  }

  async createUserInCognito(
    mobileNumber: string,
    userType: UserType,
    userId: string,
  ): Promise<string> {
    const command = new AdminCreateUserCommand({
      UserPoolId: this.userPoolId,
      Username: `+91${mobileNumber}`,
      UserAttributes: [
        { Name: 'phone_number', Value: `+91${mobileNumber}` },
        { Name: 'phone_number_verified', Value: 'true' },
        { Name: 'custom:user_type', Value: userType },
        { Name: 'custom:user_id', Value: userId },
      ],
      MessageAction: 'SUPPRESS', // We send our own welcome messages
    });

    try {
      this.logger.log(`Creating user in Cognito for mobile: ${mobileNumber}`);
      const response = await this.cognitoClient.send(command);
      const sub = response.User?.Attributes?.find(
        (attr) => attr.Name === 'sub',
      )?.Value;
      if (!sub) {
        throw new Error('Could not retrieve Cognito sub after user creation.');
      }
      this.logger.log(`Successfully created user in Cognito with sub: ${sub}`);
      return sub;
    } catch (error) {
      this.logger.error(
        `Failed to create user in Cognito for mobile: ${mobileNumber}`,
        error.stack,
      );
      if (error instanceof UsernameExistsException) {
        throw new Error('User with this mobile number already exists in Cognito.');
      }
      throw error;
    }
  }

  async initiateCustomAuth(mobileNumber: string): Promise<string> {
    const command = new AdminInitiateAuthCommand({
      AuthFlow: 'CUSTOM_AUTH',
      ClientId: this.clientId,
      UserPoolId: this.userPoolId,
      AuthParameters: {
        USERNAME: `+91${mobileNumber}`,
      },
    });

    try {
      this.logger.log(`Initiating custom auth for: ${mobileNumber}`);
      const response = await this.cognitoClient.send(command);
      if (!response.Session) {
        throw new Error('Cognito session not found after initiating auth.');
      }
      return response.Session;
    } catch (error) {
      this.logger.error(`Custom auth initiation failed for: ${mobileNumber}`, error.stack);
      if (error instanceof UserNotFoundException) {
        throw new NotAuthorizedException({
          message: 'Incorrect mobile number or user does not exist.',
        });
      }
      throw error;
    }
  }

  async respondToAuthChallenge(
    mobileNumber: string,
    otp: string,
    session: string,
  ): Promise<TokensDto> {
    const command = new AdminRespondToAuthChallengeCommand({
      ChallengeName: 'CUSTOM_CHALLENGE',
      ClientId: this.clientId,
      UserPoolId: this.userPoolId,
      Session: session,
      ChallengeResponses: {
        USERNAME: `+91${mobileNumber}`,
        ANSWER: otp,
      },
    });

    try {
      this.logger.log(`Responding to auth challenge for: ${mobileNumber}`);
      const response = await this.cognitoClient.send(command);
      const authResult = response.AuthenticationResult;
      if (!authResult?.AccessToken || !authResult?.RefreshToken) {
        throw new Error('Tokens not found in Cognito response.');
      }
      return {
        accessToken: authResult.AccessToken,
        refreshToken: authResult.RefreshToken,
      };
    } catch (error) {
      this.logger.error(`Auth challenge response failed for: ${mobileNumber}`, error.stack);
      // Cognito throws NotAuthorizedException for wrong OTP in custom auth
      if (error instanceof NotAuthorizedException) {
          throw new NotAuthorizedException({ message: 'Invalid OTP or session.' });
      }
      throw error;
    }
  }

  async updateUserStatusInCognito(username: string, enable: boolean): Promise<void> {
    const command = enable
      ? new AdminEnableUserCommand({
          UserPoolId: this.userPoolId,
          Username: username,
        })
      : new AdminDisableUserCommand({
          UserPoolId: this.userPoolId,
          Username: username,
        });

    try {
      this.logger.log(`Setting user ${username} status to ${enable ? 'Enabled' : 'Disabled'}`);
      await this.cognitoClient.send(command);
      this.logger.log(`Successfully updated status for user ${username}`);
    } catch (error) {
      this.logger.error(`Failed to update Cognito status for user ${username}`, error.stack);
      throw error;
    }
  }

  async invalidateAllUserTokens(username: string): Promise<void> {
    const command = new AdminUserGlobalSignOutCommand({
      UserPoolId: this.userPoolId,
      Username: username,
    });
    try {
      this.logger.log(`Invalidating all tokens for user ${username}`);
      await this.cognitoClient.send(command);
      this.logger.log(`Successfully invalidated tokens for user ${username}`);
    } catch (error) {
      this.logger.error(`Failed to invalidate tokens for user ${username}`, error.stack);
      // Don't throw - this is a best-effort action. Logging the error is sufficient.
    }
  }
}