#!/usr/bin/env node

/**
 * Node.js Test Runner for Matomo Tracker
 * 
 * This script runs comprehensive tests against your Matomo instance
 * using the credentials from test-config.ts
 * 
 * Usage:
 *   npm run test:node
 *   or
 *   node tests/run-tests.js
 */

// Import the compiled test functions
const { runAllTests } = require('./matomo-tests');

async function main() {
  console.log('🚀 Matomo Tracker Node.js Test Runner');
  console.log('=====================================\n');
  
  console.log('📡 Testing against: https://matomo.sonaku.vip');
  console.log('🎯 Site ID: 3\n');
  
  try {
    const results = await runAllTests();
    
    if (results.success) {
      console.log('\n🎉 SUCCESS: All tests passed!');
      process.exit(0);
    } else {
      console.log('\n❌ FAILURE: Some tests failed.');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 ERROR: Test runner failed:', error);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run the tests
main();