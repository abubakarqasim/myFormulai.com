/**
 * k6 Homepage Load Test
 * Tests homepage performance under load
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
    homepage_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 5 },
        { duration: '3m', target: 5 },
        { duration: '1m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
};

export default function () {
  const baseUrl = config.baseUrl;
  
  // Test homepage load
  const homepageResponse = http.get(`${baseUrl}/`, {
    tags: { name: 'Homepage' },
  });
  
  const homepageCheck = check(homepageResponse, {
    'homepage status is 200': (r) => r.status === 200,
    'homepage response time < 2s': (r) => r.timings.duration < 2000,
    'homepage has content': (r) => r.body.length > 0,
  });
  
  errorRate.add(!homepageCheck);
  
  sleep(1);
  
  // Test shop page load
  const shopResponse = http.get(`${baseUrl}/collections/shop-all`, {
    tags: { name: 'Shop Page' },
  });
  
  check(shopResponse, {
    'shop page status is 200': (r) => r.status === 200,
    'shop page response time < 3s': (r) => r.timings.duration < 3000,
  });
  
  sleep(1);
}

import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export function handleSummary(data) {
  return {
    'k6/reports/homepage-load-test.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
