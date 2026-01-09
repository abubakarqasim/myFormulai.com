#!/usr/bin/env node

/**
 * Enhanced Newman Runner Script
 * 
 * This script helps run Postman collections using Newman CLI
 * with proper configuration, multiple reporters, and advanced options.
 * 
 * Features:
 * - Multiple reporter support (HTML, JSON, JUnit)
 * - Data file support (CSV, JSON)
 * - Iteration count support
 * - Delay between requests
 * - Global variables support
 * - Verbose/debug mode
 * - Bail on first failure
 */

const newman = require('newman');
const path = require('path');
const fs = require('fs');

// Get command line arguments
const args = process.argv.slice(2);
let collectionName = null;
let envName = null;
let generateReport = false;
let generateJsonReport = false;
let generateJUnitReport = false;
let dataFile = null;
let iterations = 1;
let delay = 0;
let globalVarsFile = null;
let verbose = false;
let bail = false;

// Parse arguments
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--env' || arg === '-e') {
    envName = args[i + 1];
    i++;
  } else if (arg === '--report' || arg === '-r') {
    generateReport = true;
  } else if (arg === '--json-report' || arg === '-j') {
    generateJsonReport = true;
  } else if (arg === '--junit-report' || arg === '-u') {
    generateJUnitReport = true;
  } else if (arg === '--data' || arg === '-d') {
    dataFile = args[i + 1];
    i++;
  } else if (arg === '--iterations' || arg === '-n') {
    iterations = parseInt(args[i + 1]) || 1;
    i++;
  } else if (arg === '--delay' || arg === '-D') {
    delay = parseInt(args[i + 1]) || 0;
    i++;
  } else if (arg === '--globals' || arg === '-g') {
    globalVarsFile = args[i + 1];
    i++;
  } else if (arg === '--verbose' || arg === '-v') {
    verbose = true;
  } else if (arg === '--bail' || arg === '-b') {
    bail = true;
  } else if (arg.startsWith('--env=')) {
    envName = arg.split('=')[1];
  } else if (!collectionName && !arg.startsWith('-')) {
    collectionName = arg;
  }
}

if (!collectionName) {
  console.error('❌ Error: Collection name is required');
  console.log('\nUsage:');
  console.log('  npm run newman:run -- <collection-name> [options]');
  console.log('  npm run newman:run:report -- <collection-name> [options]');
  console.log('\nOptions:');
  console.log('  --env, -e <name>          Environment file name');
  console.log('  --report, -r              Generate HTML report');
  console.log('  --json-report, -j         Generate JSON report');
  console.log('  --junit-report, -u        Generate JUnit XML report');
  console.log('  --data, -d <file>         Data file (CSV or JSON)');
  console.log('  --iterations, -n <count>   Number of iterations (default: 1)');
  console.log('  --delay, -D <ms>          Delay between requests in ms');
  console.log('  --globals, -g <file>      Global variables file');
  console.log('  --verbose, -v             Verbose output');
  console.log('  --bail, -b               Stop on first failure');
  console.log('\nExamples:');
  console.log('  npm run newman:run -- formulai-api --env production');
  console.log('  npm run newman:run:report -- formulai-api --env staging --iterations 3');
  console.log('  npm run newman:run -- formulai-api --data test-data.csv --iterations 5');
  process.exit(1);
}

// Paths - all relative to newman directory
const newmanDir = path.join(process.cwd(), 'newman');
const collectionsDir = path.join(newmanDir, 'collections');
const environmentsDir = path.join(newmanDir, 'environments');
const dataDir = path.join(newmanDir, 'data');
const reportsDir = path.join(newmanDir, 'reports');

// Ensure directories exist
[collectionsDir, environmentsDir, dataDir, reportsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Find collection file
const collectionFile = path.join(collectionsDir, `${collectionName}.json`);
if (!fs.existsSync(collectionFile)) {
  console.error(`❌ Error: Collection file not found: ${collectionFile}`);
  console.log('\nAvailable collections:');
  const collections = fs.readdirSync(collectionsDir)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
  if (collections.length > 0) {
    collections.forEach(col => console.log(`  - ${col}`));
  } else {
    console.log('  (No collections found)');
  }
  process.exit(1);
}

// Find environment file (if specified)
let environmentFile = null;
if (envName) {
  environmentFile = path.join(environmentsDir, `${envName}.json`);
  if (!fs.existsSync(environmentFile)) {
    console.error(`❌ Error: Environment file not found: ${environmentFile}`);
    console.log('\nAvailable environments:');
    const environments = fs.readdirSync(environmentsDir)
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
    if (environments.length > 0) {
      environments.forEach(env => console.log(`  - ${env}`));
    } else {
      console.log('  (No environments found)');
    }
    process.exit(1);
  }
}

// Find data file (if specified)
let dataFilePath = null;
if (dataFile) {
  // Check in data directory first, then newman directory
  const possiblePaths = [
    path.join(dataDir, dataFile),
    path.join(newmanDir, dataFile),
    path.isAbsolute(dataFile) ? dataFile : path.join(process.cwd(), dataFile),
  ];

  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      dataFilePath = possiblePath;
      break;
    }
  }

  if (!dataFilePath) {
    console.error(`❌ Error: Data file not found: ${dataFile}`);
    console.log('Searched in:');
    possiblePaths.forEach(p => console.log(`  - ${p}`));
    process.exit(1);
  }
}

// Find global variables file (if specified)
let globalVarsFilePath = null;
if (globalVarsFile) {
  globalVarsFilePath = path.join(environmentsDir, `${globalVarsFile}.json`);
  if (!fs.existsSync(globalVarsFilePath)) {
    // Try as absolute path or relative to newman directory
    const altPath = path.isAbsolute(globalVarsFile) 
      ? globalVarsFile 
      : path.join(newmanDir, globalVarsFile);
    
    if (fs.existsSync(altPath)) {
      globalVarsFilePath = altPath;
    } else {
      console.error(`❌ Error: Global variables file not found: ${globalVarsFile}`);
      process.exit(1);
    }
  }
}

// Validate collection file format
let collection;
try {
  collection = require(collectionFile);
  if (!collection.info || !collection.item) {
    throw new Error('Invalid collection format');
  }
} catch (error) {
  console.error(`❌ Error: Invalid collection file format: ${collectionFile}`);
  console.error(`   ${error.message}`);
  process.exit(1);
}

// Newman options
const newmanOptions = {
  collection: collection,
  reporters: ['cli'],
  color: 'on',
  bail: bail,
  timeout: 30000,
  timeoutRequest: 30000,
  iterationCount: iterations,
  delayRequest: delay,
  verbose: verbose,
};

// Add environment if specified
if (environmentFile) {
  try {
    newmanOptions.environment = require(environmentFile);
    console.log(`📋 Using environment: ${envName}`);
  } catch (error) {
    console.error(`❌ Error: Invalid environment file format: ${environmentFile}`);
    console.error(`   ${error.message}`);
    process.exit(1);
  }
}

// Add global variables if specified
if (globalVarsFilePath) {
  try {
    newmanOptions.globals = require(globalVarsFilePath);
    console.log(`🌍 Using global variables: ${globalVarsFile}`);
  } catch (error) {
    console.error(`❌ Error: Invalid global variables file format: ${globalVarsFilePath}`);
    console.error(`   ${error.message}`);
    process.exit(1);
  }
}

// Add data file if specified
if (dataFilePath) {
  newmanOptions.iterationData = dataFilePath;
  console.log(`📄 Using data file: ${path.basename(dataFilePath)}`);
}

// Configure reporters
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const envSuffix = envName ? `-${envName}` : '';
const reportBaseName = `${collectionName}${envSuffix}-${timestamp}`;

newmanOptions.reporter = {};

// HTML reporter
if (generateReport) {
  const htmlReportFile = path.join(reportsDir, `${reportBaseName}.html`);
  newmanOptions.reporters.push('html');
  newmanOptions.reporter.html = {
    export: htmlReportFile,
    template: path.join(__dirname, '../node_modules/newman-reporter-html/lib/template.hbs'),
  };
  console.log(`📊 HTML report will be saved to: ${htmlReportFile}`);
}

// JSON reporter
if (generateJsonReport) {
  const jsonReportFile = path.join(reportsDir, `${reportBaseName}.json`);
  newmanOptions.reporters.push('json');
  newmanOptions.reporter.json = {
    export: jsonReportFile,
  };
  console.log(`📄 JSON report will be saved to: ${jsonReportFile}`);
}

// JUnit reporter (for CI/CD integration)
if (generateJUnitReport) {
  const junitReportFile = path.join(reportsDir, `${reportBaseName}.xml`);
  newmanOptions.reporters.push('junit');
  newmanOptions.reporter.junit = {
    export: junitReportFile,
  };
  console.log(`🔧 JUnit XML report will be saved to: ${junitReportFile}`);
}

// Display configuration
if (verbose) {
  console.log('\n📋 Configuration:');
  console.log(`   Collection: ${collectionName}`);
  console.log(`   Environment: ${envName || 'None'}`);
  console.log(`   Iterations: ${iterations}`);
  console.log(`   Delay: ${delay}ms`);
  console.log(`   Bail on failure: ${bail}`);
  console.log(`   Data file: ${dataFilePath ? path.basename(dataFilePath) : 'None'}`);
  console.log(`   Global variables: ${globalVarsFile || 'None'}`);
  console.log('');
}

console.log(`🚀 Running collection: ${collectionName}\n`);

// Run Newman
newman.run(newmanOptions, (err, summary) => {
  if (err) {
    console.error('\n❌ Error running collection:', err.message);
    if (verbose) {
      console.error(err.stack);
    }
    process.exit(1);
  }

  // Display summary
  const stats = summary.run.stats;
  console.log('\n📊 Test Summary:');
  console.log(`   Total Requests: ${stats.requests.total}`);
  console.log(`   Passed: ${stats.requests.total - stats.requests.failed}`);
  console.log(`   Failed: ${stats.requests.failed}`);
  console.log(`   Total Assertions: ${stats.assertions.total}`);
  console.log(`   Passed: ${stats.assertions.total - stats.assertions.failed}`);
  console.log(`   Failed: ${stats.assertions.failed}`);

  if (summary.run.failures.length > 0) {
    console.log('\n❌ Test failures detected:');
    summary.run.failures.forEach((failure, index) => {
      console.log(`\n   ${index + 1}. ${failure.error.name}`);
      console.log(`      Request: ${failure.source.name || 'Unknown'}`);
      console.log(`      Message: ${failure.error.message}`);
      if (verbose && failure.error.stack) {
        console.log(`      Stack: ${failure.error.stack}`);
      }
    });
    
    // Exit with appropriate code
    process.exit(1);
  }

  console.log('\n✅ All tests passed!');
  
  // Report file locations
  const reportFiles = [];
  if (generateReport) {
    reportFiles.push(`HTML: ${path.join(reportsDir, `${reportBaseName}.html`)}`);
  }
  if (generateJsonReport) {
    reportFiles.push(`JSON: ${path.join(reportsDir, `${reportBaseName}.json`)}`);
  }
  if (generateJUnitReport) {
    reportFiles.push(`JUnit: ${path.join(reportsDir, `${reportBaseName}.xml`)}`);
  }
  
  if (reportFiles.length > 0) {
    console.log('\n📊 Reports generated:');
    reportFiles.forEach(file => console.log(`   ${file}`));
  }
  
  process.exit(0);
});
