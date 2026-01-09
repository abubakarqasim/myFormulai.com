import { Helpers } from './Helpers';

/**
 * Email Generator Utility
 * 
 * Provides various email generation methods for testing
 */
export class EmailGenerator {
  /**
   * Generate random email with test prefix and 3 random digits
   * Format: testXXX@domain (e.g., test123@formulai.com)
   * @param domain - Email domain (default: 'formulai.com')
   * @returns Random email address
   */
  static generateTestEmail(domain: string = 'formulai.com'): string {
    // Generate 3 random digits (000-999)
    const randomDigits = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    return `test${randomDigits}@${domain}`;
  }

  /**
   * Generate unique email with timestamp
   * Format: testXXX_timestamp@domain (e.g., test123_1767810118824@formulai.com)
   * @param domain - Email domain (default: 'formulai.com')
   * @returns Unique email address
   */
  static generateUniqueEmail(domain: string = 'formulai.com'): string {
    const randomDigits = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    const timestamp = Date.now();
    return `test${randomDigits}_${timestamp}@${domain}`;
  }

  /**
   * Generate email with custom prefix and random digits
   * Format: prefixXXX@domain
   * @param prefix - Email prefix (default: 'test')
   * @param digits - Number of random digits (default: 3)
   * @param domain - Email domain (default: 'formulai.com')
   * @returns Random email address
   */
  static generateEmailWithDigits(
    prefix: string = 'test',
    digits: number = 3,
    domain: string = 'formulai.com'
  ): string {
    const maxValue = Math.pow(10, digits) - 1;
    const randomDigits = String(Math.floor(Math.random() * (maxValue + 1))).padStart(digits, '0');
    return `${prefix}${randomDigits}@${domain}`;
  }

  /**
   * Generate email with test prefix, 3 random digits, and timestamp
   * Format: testXXX_timestamp@domain
   * @param domain - Email domain (default: 'formulai.com')
   * @returns Unique email address
   */
  static generateTestEmailWithTimestamp(domain: string = 'formulai.com'): string {
    const randomDigits = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    const timestamp = Date.now();
    return `test${randomDigits}_${timestamp}@${domain}`;
  }
}
