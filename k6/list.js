/**
 * k6 Scripts Lister
 * Lists all available k6 test scripts
 */

const fs = require('fs');
const path = require('path');

const scriptsDir = path.join(__dirname, 'scripts');

console.log('📋 Available k6 Test Scripts:\n');

if (!fs.existsSync(scriptsDir)) {
  console.log('❌ Scripts directory not found');
  process.exit(1);
}

const scripts = fs.readdirSync(scriptsDir)
  .filter(file => file.endsWith('.js'))
  .map(file => ({
    name: file.replace('.js', ''),
    path: path.join(scriptsDir, file),
  }));

if (scripts.length === 0) {
  console.log('No k6 scripts found');
  process.exit(0);
}

scripts.forEach((script, index) => {
  console.log(`${index + 1}. ${script.name}`);
  console.log(`   Path: ${script.path}\n`);
});

console.log(`\nTotal: ${scripts.length} script(s)`);
console.log('\nUsage:');
console.log('  node k6/runner.js <script-name> [--env=<environment>]');
console.log('\nExamples:');
console.log('  node k6/runner.js smoke-test');
console.log('  node k6/runner.js homepage --env=staging');
console.log('  node k6/runner.js stress-test --env=prod');
