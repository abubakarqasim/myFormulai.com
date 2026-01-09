import { Helpers } from '../../utils/Helpers';

/**
 * API Test Data
 * 
 * Centralized test data for API testing
 */
export const ApiTestData = {
  // Authentication test data
  AUTH: {
    VALID_CREDENTIALS: {
      email: 'test@formulai.com',
      password: 'Test@123456',
    },
    INVALID_CREDENTIALS: {
      email: 'invalid@example.com',
      password: 'wrongpassword',
    },
    NEW_USER: {
      email: `test_${Date.now()}@formulai.com`,
      password: 'Test@123456',
      firstName: 'John',
      lastName: 'Doe',
    },
  },

  // User test data
  USER: {
    UPDATE_PROFILE: {
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '1234567890',
    },
    CHANGE_PASSWORD: {
      currentPassword: 'Test@123456',
      newPassword: 'NewTest@123456',
    },
  },

  // Product test data
  PRODUCT: {
    SEARCH_QUERY: 'vitamin',
    FILTERS: {
      category: 'supplements',
      minPrice: 10,
      maxPrice: 100,
    },
  },

  // Order test data
  ORDER: {
    CREATE: {
      items: [
        { productId: '1', quantity: 2 },
        { productId: '2', quantity: 1 },
      ],
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
    },
  },

  // Helper methods
  generateEmail(): string {
    return Helpers.generateRandomEmail('formulai.com');
  },

  generateUserData() {
    return {
      email: this.generateEmail(),
      password: 'Test@123456',
      firstName: Helpers.generateRandomString(6),
      lastName: Helpers.generateRandomString(6),
    };
  },
} as const;
