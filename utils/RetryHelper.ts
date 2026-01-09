import { Logger } from './Logger';

/**
 * Retry configuration options
 */
export interface RetryOptions {
  maxRetries?: number;
  delay?: number;
  backoff?: 'linear' | 'exponential';
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  delay: 1000,
  backoff: 'linear',
  onRetry: (attempt, error) => {
    Logger.warn(`Retry attempt ${attempt} failed: ${error.message}`);
  },
};

/**
 * Retry Helper Utility
 * 
 * Provides robust retry mechanisms for flaky operations.
 * Supports linear and exponential backoff strategies.
 */
export class RetryHelper {
  /**
   * Retry a function with configurable options
   * 
   * @param fn - Function to retry
   * @param options - Retry configuration options
   * @returns Result of the function
   * @throws Last error if all retries fail
   */
  static async retry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const config = { ...DEFAULT_RETRY_OPTIONS, ...options };
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        if (attempt < config.maxRetries) {
          const delay = this.calculateDelay(attempt, config.delay, config.backoff);
          
          if (config.onRetry) {
            config.onRetry(attempt, lastError);
          }

          Logger.debug(`Retrying in ${delay}ms... (attempt ${attempt}/${config.maxRetries})`);
          await this.wait(delay);
        }
      }
    }

    throw lastError || new Error('Retry failed: Unknown error');
  }

  /**
   * Calculate delay based on attempt number and backoff strategy
   */
  private static calculateDelay(
    attempt: number,
    baseDelay: number,
    backoff: 'linear' | 'exponential'
  ): number {
    if (backoff === 'exponential') {
      return baseDelay * Math.pow(2, attempt - 1);
    }
    return baseDelay * attempt;
  }

  /**
   * Wait for a specific amount of time
   */
  private static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry with exponential backoff (convenience method)
   */
  static async retryWithExponentialBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    initialDelay: number = 1000
  ): Promise<T> {
    return this.retry(fn, {
      maxRetries,
      delay: initialDelay,
      backoff: 'exponential',
    });
  }

  /**
   * Retry with linear backoff (convenience method)
   */
  static async retryWithLinearBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    return this.retry(fn, {
      maxRetries,
      delay,
      backoff: 'linear',
    });
  }
}
