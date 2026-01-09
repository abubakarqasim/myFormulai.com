/**
 * k6 Spike Test
 * Tests system behavior under sudden load spikes
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';
import { config } from '../config.js';

// Custom metrics
const errorRate = new Rate('errors');

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<5000'],
    http_req_failed: ['rate<0.1'], // Allow up to 10% errors in spike test
  },
  scenarios: config.scenarios.spike,
};

export default function () {
  const baseUrl = config.baseUrl;
  
  // Test homepage
  const homepageResponse = http.get(`${baseUrl}/`, {
    tags: { name: 'Homepage' },
  });
  
  check(homepageResponse, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage loads under spike': (r) => r.timings.duration < 10000,
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
}

import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export function handleSummary(data) {
  return {
    'k6/reports/spike-test.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
