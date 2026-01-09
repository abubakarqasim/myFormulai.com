#!/usr/bin/env node

/**
 * Newman List Script
 * 
 * Lists all available Postman collections and environments
 */

const fs = require('fs');
const path = require('path');

const newmanDir = path.join(process.cwd(), 'newman');
const collectionsDir = path.join(newmanDir, 'collections');
const environmentsDir = path.join(newmanDir, 'environments');
const dataDir = path.join(newmanDir, 'data');

console.log('📋 Available Postman Collections:\n');

if (fs.existsSync(collectionsDir)) {
  const collections = fs.readdirSync(collectionsDir)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
  
  if (collections.length > 0) {
    collections.forEach(col => console.log(`  ✓ ${col}`));
  } else {
    console.log('  (No collections found)');
    console.log('  Export your Postman collection to: newman/collections/');
  }
} else {
  console.log('  (Collections directory not found)');
}

console.log('\n🌍 Available Environments:\n');

if (fs.existsSync(environmentsDir)) {
  const environments = fs.readdirSync(environmentsDir)
    .filter(file => file.endsWith('.json'))
    .map(file => file.replace('.json', ''));
  
  if (environments.length > 0) {
    environments.forEach(env => console.log(`  ✓ ${env}`));
  } else {
    console.log('  (No environments found)');
    console.log('  Export your Postman environment to: newman/environments/');
  }
} else {
  console.log('  (Environments directory not found)');
}

console.log('\n📄 Available Data Files:\n');

if (fs.existsSync(dataDir)) {
  const dataFiles = fs.readdirSync(dataDir)
    .filter(file => file.endsWith('.csv') || file.endsWith('.json'));
  
  if (dataFiles.length > 0) {
    dataFiles.forEach(file => console.log(`  ✓ ${file}`));
  } else {
    console.log('  (No data files found)');
    console.log('  Place CSV or JSON data files in: newman/data/');
  }
} else {
  console.log('  (Data directory not found)');
}

console.log('\n💡 Usage:');
console.log('  npm run newman:run -- <collection-name> [--env <environment-name>]');
console.log('  npm run newman:run:report -- <collection-name> [--env <environment-name>]');
console.log('  npm run newman:run:all -- <collection-name> [--env <environment-name>]');
