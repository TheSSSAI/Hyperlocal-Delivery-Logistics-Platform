import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  AdminInitiateAuthCommand,
  AdminInitiateAuthCommandInput,
  AdminRespondToAuthChallengeCommand,
  AdminRespondToAuthChallengeCommandInput,
  AdminGetUserCommand,
  AdminDisableUserCommand,
  AttributeType,
  UserNotFoundException,
  UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import { UserType } from 'src/modules/users/entities/user.entity';

@Injectable()
export class CognitoService {
  private readonly logger = new Logger(CognitoService.name);
  private readonly cognitoClient: CognitoIdentityProviderClient;
  private readonly userPoolId: string;
  private readonly clientId: string;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    this.userPoolId = this.configService.get<string>('COGNITO_USER_POOL_ID');
    this.clientId = this.configService.get<string>('COGNITO_CLIENT_ID');

    if (!region || !this.userPoolId || !this.clientId) {
      throw new Error('Cognito configuration is missing from environment variables.');
    }

    this.cognitoClient = new CognitoIdentityProviderClient({ region });
  }

  async createUserInCognito(
    mobileNumber: string,
    userType: UserType,
    userId: string
  ): Promise<string> {
    const params: AdminCreateUserCommandInput = {
      UserPoolId: this.userPoolId,
      Username: mobileNumber,
      UserAttributes: [
        { Name: 'phone_number', Value: mobileNumber },
        { Name: 'phone_number_verified', Value: 'true' },
        { Name: 'custom:user_type', Value: userType },
        { Name: 'custom:user_id', Value: userId },
      ],
      MessageAction: 'SUPPRESS', // We send our own OTP via SNS
    };

    try {
      this.logger.log(`Attempting to create user ${mobileNumber} in Cognito.`);
      const command = new AdminCreateUserCommand(params);
      const response = await this.cognitoClient.send(command);
      const cognitoSub = response.User?.Attributes?.find(
        (attr) => attr.Name === 'sub',
      )?.Value;
        
      if (!cognitoSub) {
        throw new Error('Could not retrieve Cognito SUB after user creation.');
      }

      this.logger.log(`Successfully created user ${mobileNumber} in Cognito with SUB: ${cognitoSub}`);
      return cognitoSub;

    } catch (error) {
      if (error instanceof UsernameExistsException) {
        this.logger.warn(`User ${mobileNumber} already exists in Cognito.`);
      } else {
        this.logger.error(`Error creating user ${mobileNumber} in Cognito`, error);
      }
      throw error;
    }
  }

  async adminInitiateAuth(username: string) {
    const params: AdminInitiateAuthCommandInput = {
      AuthFlow: 'CUSTOM_AUTH',
      ClientId: this.clientId,
      UserPoolId: this.userPoolId,
      AuthParameters: {
        USERNAME: username,
      },
    };

    try {
      this.logger.log(`Initiating custom auth for ${username}.`);
      const command = new AdminInitiateAuthCommand(params);
      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      this.logger.error(`Error initiating custom auth for ${username}`, error);
      throw error;
    }
  }
  
  async adminRespondToAuthChallenge(
    username: string,
    session: string,
    answer: string,
  ) {
    const params: AdminRespondToAuthChallengeCommandInput = {
      ChallengeName: 'CUSTOM_CHALLENGE',
      ClientId: this.clientId,
      UserPoolId: this.userPoolId,
      Session: session,
      ChallengeResponses: {
        USERNAME: username,
        ANSWER: answer,
      },
    };

    try {
      this.logger.log(`Responding to auth challenge for ${username}.`);
      const command = new AdminRespondToAuthChallengeCommand(params);
      const response = await this.cognitoClient.send(command);
      return response;
    } catch (error) {
      this.logger.error(`Error responding to auth challenge for ${username}`, error);
      throw error;
    }
  }


  async adminGetUser(username: string) {
    try {
      const command = new AdminGetUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });
      return await this.cognitoClient.send(command);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        return null;
      }
      this.logger.error(`Error getting user ${username} from Cognito.`, error);
      throw error;
    }
  }

  async adminDisableUser(username: string): Promise<void> {
    try {
      this.logger.log(`Disabling user ${username} in Cognito.`);
      const command = new AdminDisableUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });
      await this.cognitoClient.send(command);
      this.logger.log(`Successfully disabled user ${username}.`);
    } catch (error) {
      this.logger.error(`Error disabling user ${username} in Cognito`, error);
      throw error;
    }
  }
}