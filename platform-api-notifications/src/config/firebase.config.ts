import { registerAs } from '@nestjs/config';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { validateConfig } from '../shared/utils/config.validator';

class FirebaseConfig {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  privateKey: string;

  @IsEmail()
  @IsNotEmpty()
  clientEmail: string;
}

/**
 * Note on FIREBASE_PRIVATE_KEY:
 * The private key from the Firebase service account JSON is a multi-line string.
 * To pass it as an environment variable (e.g., in Kubernetes secrets or .env files),
 * it's best to Base64 encode the entire key (including -----BEGIN... and -----END...).
 * This factory will then decode it back to its original format.
 *
 * Example:
 * 1. `cat your-service-account.json | jq -r .private_key | base64`
 * 2. Set the output as the value for FIREBASE_PRIVATE_KEY environment variable.
 */
export const firebaseConfig = registerAs('firebase', () => {
  const encodedKey = process.env.FIREBASE_PRIVATE_KEY;
  let decodedKey = encodedKey;

  // Decode if it looks like a base64 string
  if (encodedKey && !encodedKey.startsWith('-----BEGIN PRIVATE KEY-----')) {
    try {
      decodedKey = Buffer.from(encodedKey, 'base64').toString('utf-8');
    } catch (error) {
      throw new Error('Failed to decode FIREBASE_PRIVATE_KEY. Ensure it is a valid Base64 encoded string.');
    }
  }

  const config = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: decodedKey,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  validateConfig(config, FirebaseConfig);

  return {
    projectId: config.projectId,
    privateKey: config.privateKey,
    clientEmail: config.clientEmail,
  };
});