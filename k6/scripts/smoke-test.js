/**
 * k6 Smoke Test
 * Quick validation test with minimal load
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { config } from '../config.js';

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.01'],
  },
  scenarios: config.scenarios.smoke,
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
    'homepage response time < 2s': (r) => r.timings.duration < 2000,
  });
  
  sleep(1);
  
  // Test API health
  const healthResponse = http.get(`${apiBaseUrl}/api/health`, {
    tags: { name: 'Health Check' },
  });
  
  check(healthResponse, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}

import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export function handleSummary(data) {
  return {
    'k6/reports/smoke-test.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
