/**
 * Environment types
 */
export type Environment = 'dev' | 'staging' | 'prod' | 'local';

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  name: Environment;
  baseUrl: string;
  apiBaseUrl: string;
  timeout: number;
  retries: number;
  workers: number;
  headless: boolean;
  screenshot: boolean | 'only-on-failure';
  video: boolean | 'retain-on-failure' | 'on-first-retry';
  trace: boolean | 'on-first-retry' | 'retain-on-failure' | 'on';
}

/**
 * Environment configurations
 */
export const environments: Record<Environment, EnvironmentConfig> = {
  local: {
    name: 'local',
    baseUrl: process.env.LOCAL_BASE_URL || 'http://localhost:3000',
    apiBaseUrl: process.env.LOCAL_API_BASE_URL || 'http://localhost:3001',
    timeout: 60000,
    retries: 0,
    workers: 1,
    headless: false,
    screenshot: true,
    video: true,
    trace: true,
  },
  dev: {
    name: 'dev',
    baseUrl: process.env.DEV_BASE_URL || 'https://dev.example.com',
    apiBaseUrl: process.env.DEV_API_BASE_URL || 'https://api-dev.example.com',
    timeout: 60000,
    retries: 1,
    workers: 2,
    headless: true,
    screenshot: true,
    video: false,
    trace: true,
  },
  staging: {
    name: 'staging',
    baseUrl: process.env.STAGING_BASE_URL || 'https://staging.example.com',
    apiBaseUrl: process.env.STAGING_API_BASE_URL || 'https://api-staging.example.com',
    timeout: 60000,
    retries: 2,
    workers: 4,
    headless: true,
    screenshot: true,
    video: true,
    trace: true,
  },
  prod: {
    name: 'prod',
    baseUrl: process.env.PROD_BASE_URL || 'https://example.com',
    apiBaseUrl: process.env.PROD_API_BASE_URL || 'https://api.example.com',
    timeout: 60000,
    retries: 2,
    workers: process.env.CI ? 1 : 4,
    headless: true,
    screenshot: true,
    video: true,
    trace: true,
  },
};
