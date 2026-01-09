/**
 * Test data constants
 * Centralized location for all test data
 * Uses environment variables when available, falls back to defaults
 */
import { Env } from '../../config/env';
import { EmailGenerator } from '../../utils/EmailGenerator';

export const TestData = {
  // User credentials (from environment variables or defaults)
  CREDENTIALS: {
    VALID_EMAIL: Env.get('TEST_USER_EMAIL', 'test@example.com'),
    VALID_PASSWORD: Env.get('TEST_USER_PASSWORD', 'password123'),
    INVALID_EMAIL: 'invalid-email',
    INVALID_PASSWORD: 'wrong',
  },

  // Form data
  FORM_DATA: {
    VALID_NAME: 'John Doe',
    VALID_PHONE: '1234567890',
    VALID_MESSAGE: 'This is a test message',
  },

  // Search queries
  SEARCH: {
    VALID_QUERY: 'test query',
    INVALID_QUERY: '',
    LONG_QUERY: 'a'.repeat(1000),
  },

  // Quiz data
  QUIZ: {
    DATE_OF_BIRTH: '1997-10-13', // Format: YYYY-MM-DD (Month: 10, Day: 13, Year: 1997)
    HEIGHT_FEET: '5', // Height in feet
    HEIGHT_INCHES: '11', // Height in inches
    WEIGHT_LBS: '100', // Weight in pounds
    EMAIL: 'test@formulai.com', // Email for quiz results submission (static)
    generateEmail: () => EmailGenerator.generateTestEmail('formulai.com'), // Generate random email for quiz
    FIRST_NAME: 'John', // First name for account registration
    LAST_NAME: 'Doe', // Last name for account registration
    PASSWORD: 'Test@123456', // Password for account registration
  },

  // Registration data
  REGISTER: {
    FIRST_NAME: 'John', // First name for new user registration
    LAST_NAME: 'Doe', // Last name for new user registration
    PASSWORD: 'Test@123456', // Password for new user registration
    // Email generation methods
    generateEmail: () => EmailGenerator.generateTestEmail('formulai.com'), // Format: testXXX@formulai.com
    generateUniqueEmail: () => EmailGenerator.generateUniqueEmail('formulai.com'), // Format: testXXX_timestamp@formulai.com
  },

  // Shipping/Checkout data
  SHIPPING: {
    ADDRESS: '123 Main Street', // Street address
    APARTMENT: 'Apt 4B', // Apartment/address line 2
    CITY: 'New York', // City name
    STATE: 'NY', // State code (optional, will select any if not provided)
    ZIP_CODE: '10001', // Zip/postal code
  },

  // Payment test data (Shopify test cards)
  PAYMENT: {
    // Successful payment test cards
    SUCCESS_CARD: {
      NUMBER: '4242 4242 4242 4242',
      EXPIRY: '12/25',
      CVV: '123',
      NAME: 'Test User',
    },
    // Declined payment test card
    DECLINE_CARD: {
      NUMBER: '4000 0000 0000 0002',
      EXPIRY: '12/25',
      CVV: '123',
      NAME: 'Test User',
    },
    // 3D Secure test card
    SECURE_3D_CARD: {
      NUMBER: '4000 0027 6000 3184',
      EXPIRY: '12/25',
      CVV: '123',
      NAME: 'Test User',
    },
  },

  // Search test data
  SEARCH_PRODUCTS: {
    VALID_SEARCH: 'AI1', // Product name to search
    VALID_BRAND: 'Formulai', // Brand name
    INVALID_SEARCH: 'xyzabc123nonexistent', // Non-existent product
    CATEGORY: 'Vitamins & Supplements', // Category to filter
  },

  // Email generation utilities
  EMAIL: {
    // Generate test email with 3 random digits
    generateTestEmail: (domain: string = 'formulai.com') => EmailGenerator.generateTestEmail(domain),
    // Generate unique email with timestamp
    generateUniqueEmail: (domain: string = 'formulai.com') => EmailGenerator.generateUniqueEmail(domain),
    // Generate email with custom prefix and digits
    generateEmailWithDigits: (prefix: string = 'test', digits: number = 3, domain: string = 'formulai.com') => 
      EmailGenerator.generateEmailWithDigits(prefix, digits, domain),
    // Generate email with timestamp
    generateTestEmailWithTimestamp: (domain: string = 'formulai.com') => 
      EmailGenerator.generateTestEmailWithTimestamp(domain),
  },

  // Add more test data categories here
} as const;
