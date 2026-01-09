import { Page, Locator } from '@playwright/test';

/**
 * Helper utility functions
 * 
 * Provides common utility methods for test automation.
 * All methods are static and can be used without instantiation.
 */
export class Helpers {
  /**
   * Generate random string with customizable character set
   * @param length - Length of the string (default: 10)
   * @param charset - Character set to use (default: alphanumeric)
   * @returns Random string
   */
  static generateRandomString(length: number = 10, charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  /**
   * Generate random email address
   * @param domain - Email domain (default: 'example.com')
   * @returns Random email address
   */
  static generateRandomEmail(domain: string = 'example.com'): string {
    return `test_${this.generateRandomString(8)}@${domain}`;
  }

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
   * Wait for a specific amount of time
   * @param ms - Milliseconds to wait
   * @returns Promise that resolves after the specified time
   */
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Format date to string
   * @param date - Date object to format
   * @param format - Format string (default: 'YYYY-MM-DD')
   * @returns Formatted date string
   */
  static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day);
  }

  /**
   * Scroll to element
   * @param page - Playwright page object
   * @param selector - CSS selector or locator
   */
  static async scrollToElement(page: Page, selector: string | Locator): Promise<void> {
    const element = typeof selector === 'string' ? page.locator(selector) : selector;
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Generate timestamp string
   * @returns Timestamp string in format: YYYYMMDDHHmmss
   */
  static generateTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  /**
   * Generate unique ID
   * @param prefix - Prefix for the ID (default: 'id')
   * @returns Unique ID string
   */
  static generateUniqueId(prefix: string = 'id'): string {
    return `${prefix}_${Date.now()}_${this.generateRandomString(6)}`;
  }

  /**
   * Parse JSON safely
   * @param jsonString - JSON string to parse
   * @param defaultValue - Default value if parsing fails
   * @returns Parsed object or default value
   */
  static parseJSON<T>(jsonString: string, defaultValue: T): T {
    try {
      return JSON.parse(jsonString) as T;
    } catch {
      return defaultValue;
    }
  }

  /**
   * Deep clone an object
   * @param obj - Object to clone
   * @returns Cloned object
   */
  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj)) as T;
  }

  /**
   * Check if a string is a valid email
   * @param email - Email string to validate
   * @returns True if valid email, false otherwise
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if a string is a valid URL
   * @param url - URL string to validate
   * @returns True if valid URL, false otherwise
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Truncate string to specified length
   * @param str - String to truncate
   * @param length - Maximum length
   * @param suffix - Suffix to add if truncated (default: '...')
   * @returns Truncated string
   */
  static truncate(str: string, length: number, suffix: string = '...'): string {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  }

  /**
   * Capitalize first letter of a string
   * @param str - String to capitalize
   * @returns Capitalized string
   */
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Format number with commas
   * @param num - Number to format
   * @returns Formatted number string
   */
  static formatNumber(num: number): string {
    return num.toLocaleString();
  }

  /**
   * Get random number between min and max (inclusive)
   * @param min - Minimum value
   * @param max - Maximum value
   * @returns Random number
   */
  static randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Get random item from array
   * @param array - Array to pick from
   * @returns Random item
   */
  static randomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Shuffle array (Fisher-Yates algorithm)
   * @param array - Array to shuffle
   * @returns Shuffled array (new array, original not modified)
   */
  static shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
