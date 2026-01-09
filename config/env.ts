import * as dotenv from 'dotenv';
import * as path from 'path';
import { Environment, environments, EnvironmentConfig } from './environments';

/**
 * Load environment variables from .env file
 */
function loadEnvFile(): void {
  const env = process.env.ENV || process.env.NODE_ENV || 'local';
  const envFile = `.env.${env}`;
  const envPath = path.resolve(process.cwd(), envFile);

  // Try to load environment-specific file
  const envLoaded = dotenv.config({ path: envPath });

  // If environment-specific file doesn't exist, try default .env
  if (envLoaded.error && env !== 'local') {
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
  } else {
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
  }
}

// Load environment variables
loadEnvFile();

/**
 * Get current environment
 */
export function getEnvironment(): Environment {
  const env = (process.env.ENV || process.env.NODE_ENV || 'local').toLowerCase() as Environment;
  
  if (!environments[env]) {
    console.warn(`Unknown environment "${env}", defaulting to "local"`);
    return 'local';
  }
  
  return env;
}

/**
 * Get current environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const env = getEnvironment();
  return environments[env];
}

/**
 * Environment configuration instance
 */
export const envConfig = getEnvironmentConfig();

/**
 * Environment helper functions
 */
export const Env = {
  /**
   * Get current environment name
   */
  get current(): Environment {
    return getEnvironment();
  },

  /**
   * Check if current environment is production
   */
  isProd(): boolean {
    return getEnvironment() === 'prod';
  },

  /**
   * Check if current environment is staging
   */
  isStaging(): boolean {
    return getEnvironment() === 'staging';
  },

  /**
   * Check if current environment is development
   */
  isDev(): boolean {
    return getEnvironment() === 'dev';
  },

  /**
   * Check if current environment is local
   */
  isLocal(): boolean {
    return getEnvironment() === 'local';
  },

  /**
   * Get environment variable with fallback
   */
  get(key: string, defaultValue?: string): string {
    return process.env[key] || defaultValue || '';
  },

  /**
   * Get boolean environment variable
   */
  getBoolean(key: string, defaultValue: boolean = false): boolean {
    const value = process.env[key];
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true' || value === '1';
  },

  /**
   * Get number environment variable
   */
  getNumber(key: string, defaultValue: number): number {
    const value = process.env[key];
    if (!value) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  },
};

// Export environment config for easy access
export default envConfig;
