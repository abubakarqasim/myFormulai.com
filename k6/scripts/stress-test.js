/**
 * k6 Stress Test
 * Tests system behavior under high load
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { config } from '../config.js';

// Custom metrics
const errorRate = new Rate('errors');

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<5000', 'p(99)<10000'],
    http_req_failed: ['rate<0.05'], // Allow up to 5% errors in stress test
  },
  scenarios: config.scenarios.stress,
};

export default function () {
  const baseUrl = config.baseUrl;
  const apiBaseUrl = config.apiBaseUrl;
  
  // Test homepage
  const homepageResponse = http.get(`${baseUrl}/`, {
    tags: { name: 'Homepage' },
  });
  
  check(homepageResponse, {
    'homepage status is 200': (r) => r.status === 200,
  });
  
  errorRate.add(homepageResponse.status !== 200);
  
  sleep(0.5);
  
  // Test shop page
  const shopResponse = http.get(`${baseUrl}/collections/shop-all`, {
    tags: { name: 'Shop Page' },
  });
  
  check(shopResponse, {
    'shop page status is 200': (r) => r.status === 200,
  });
  
  errorRate.add(shopResponse.status !== 200);
  
  sleep(0.5);
  
  // Test API health
  const healthResponse = http.get(`${apiBaseUrl}/api/health`, {
    tags: { name: 'Health Check' },
  });
  
  check(healthResponse, {
    'health check status is 200': (r) => r.status === 200,
  });
  
  errorRate.add(healthResponse.status !== 200);
  
  sleep(1);
}

import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export function handleSummary(data) {
  return {
    'k6/reports/stress-test.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
