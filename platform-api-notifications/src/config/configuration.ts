import awsConfig from './aws.config';
import databaseConfig from './database.config';
import firebaseConfig from './firebase.config';

/**
 * Aggregates all modular configuration functions into a single array.
 * This array is loaded by the global `ConfigModule` in `app.module.ts`,
 * making all namespaced configurations available throughout the application
 * via the `ConfigService`.
 */
const configuration = [awsConfig, databaseConfig, firebaseConfig];

export default configuration;