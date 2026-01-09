/**
 * k6 API Endpoints Load Test
 * Tests API endpoints performance under load
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { config } from '../config.js';

// Custom metrics
const errorRate = new Rate('errors');

export const options = {
  thresholds: config.thresholds,
  scenarios: {
    api_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 10 },
        { duration: '3m', target: 10 },
        { duration: '1m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
};

export default function () {
  const apiBaseUrl = config.apiBaseUrl;
  
  // Test health check endpoint
  const healthResponse = http.get(`${apiBaseUrl}/api/health`, {
    tags: { name: 'Health Check' },
  });
  
  check(healthResponse, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(0.5);
  
  // Test products endpoint
  const productsResponse = http.get(`${apiBaseUrl}/api/products`, {
    tags: { name: 'Products List' },
  });
  
  check(productsResponse, {
    'products status is 200': (r) => r.status === 200,
    'products response time < 2s': (r) => r.timings.duration < 2000,
    'products returns data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body) || typeof body === 'object';
      } catch {
        return false;
      }
    },
  });
  
  errorRate.add(productsResponse.status !== 200);
  
  sleep(1);
  
  // Test product search endpoint
  const searchResponse = http.get(`${apiBaseUrl}/api/products/search?q=supplement`, {
    tags: { name: 'Product Search' },
  });
  
  check(searchResponse, {
    'search status is 200': (r) => r.status === 200,
    'search response time < 2s': (r) => r.timings.duration < 2000,
  });
  
  sleep(1);
}

export function handleSummary(data) {
  return {
    'k6/reports/api-load-test.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
