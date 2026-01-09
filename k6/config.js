/**
 * k6 Configuration
 * Centralized configuration for k6 load tests
 */

export const config = {
  // Base URL from environment
  baseUrl: __ENV.BASE_URL || 'https://myformulai.com',
  apiBaseUrl: __ENV.API_BASE_URL || __ENV.BASE_URL || 'https://myformulai.com',
  
  // Test thresholds
  thresholds: {
    // HTTP request duration thresholds
    http_req_duration: ['p(95)<2000', 'p(99)<5000'], // 95% of requests should be below 2s, 99% below 5s
    http_req_failed: ['rate<0.01'], // Error rate should be less than 1%
    
    // Iteration duration
    iteration_duration: ['p(95)<5000'],
    
    // Data received/sent
    data_received: ['rate>1000'], // Should receive at least 1KB/s
    data_sent: ['rate>100'], // Should send at least 100B/s
  },
  
  // Test scenarios
  scenarios: {
    // Smoke test - quick validation
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '1m',
    },
    
    // Load test - normal load
    load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 10 }, // Ramp up to 10 users over 2 minutes
        { duration: '5m', target: 10 }, // Stay at 10 users for 5 minutes
        { duration: '2m', target: 0 },  // Ramp down to 0 users over 2 minutes
      ],
      gracefulRampDown: '30s',
    },
    
    // Stress test - high load
    stress: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 20 }, // Ramp up to 20 users
        { duration: '5m', target: 20 }, // Stay at 20 users
        { duration: '2m', target: 50 }, // Ramp up to 50 users
        { duration: '5m', target: 50 }, // Stay at 50 users
        { duration: '2m', target: 0 },  // Ramp down
      ],
      gracefulRampDown: '30s',
    },
    
    // Spike test - sudden load increase
    spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 10 }, // Normal load
        { duration: '30s', target: 100 }, // Spike to 100 users
        { duration: '1m', target: 10 }, // Back to normal
        { duration: '1m', target: 0 },  // Ramp down
      ],
      gracefulRampDown: '30s',
    },
  },
};
