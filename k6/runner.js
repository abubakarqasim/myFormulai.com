/**
 * k6 Test Runner
 * Executes k6 load tests with proper configuration
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure reports directory exists
const reportsDir = path.join(__dirname, 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Get command line arguments
const args = process.argv.slice(2);
const scriptName = args[0] || 'smoke-test';
const environment = args.find(arg => arg.startsWith('--env='))?.split('=')[1] || 'local';

// Map environment to base URL
const envUrls = {
  local: 'http://localhost:3000',
  dev: 'https://dev.myformulai.com',
  staging: 'https://staging.myformulai.com',
  prod: 'https://myformulai.com',
};

const baseUrl = envUrls[environment] || envUrls.local;

// Available scripts
const scripts = {
  'smoke-test': 'scripts/smoke-test.js',
  'homepage': 'scripts/homepage.js',
  'api-endpoints': 'scripts/api-endpoints.js',
  'stress-test': 'scripts/stress-test.js',
  'spike-test': 'scripts/spike-test.js',
};

const scriptPath = scripts[scriptName];

if (!scriptPath) {
  console.error(`❌ Unknown script: ${scriptName}`);
  console.log('\nAvailable scripts:');
  Object.keys(scripts).forEach(name => {
    console.log(`  - ${name}`);
  });
  process.exit(1);
}

const fullScriptPath = path.join(__dirname, scriptPath);

if (!fs.existsSync(fullScriptPath)) {
  console.error(`❌ Script not found: ${fullScriptPath}`);
  process.exit(1);
}

// Build k6 command
const k6Command = [
  'k6',
  'run',
  `--env BASE_URL=${baseUrl}`,
  `--env API_BASE_URL=${baseUrl}`,
  fullScriptPath,
].join(' ');

console.log(`🚀 Running k6 test: ${scriptName}`);
console.log(`📍 Environment: ${environment}`);
console.log(`🌐 Base URL: ${baseUrl}`);
console.log(`📄 Script: ${scriptPath}\n`);

try {
  execSync(k6Command, {
    stdio: 'inherit',
    cwd: __dirname,
  });
  console.log('\n✅ k6 test completed successfully');
} catch (error) {
  console.error('\n❌ k6 test failed');
  process.exit(1);
}
