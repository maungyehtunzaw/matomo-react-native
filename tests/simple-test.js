const MatomoTracker = require('../lib/src/MatomoTracker').default;

// Test configuration
const testConfig = {
  urlBase: 'https://matomo.sonaku.vip',
  siteId: 3,
  userId: 'test-user-' + Date.now(),
  log: true,
  disabled: false
};

// Create test instance
const testInstance = new MatomoTracker(testConfig);

async function runBasicTest() {
  console.log('🧪 Running basic Matomo tracking test...\n');
  
  try {
    // Test 1: Basic app start
    console.log('1. Testing app start tracking...');
    await testInstance.trackAppStart({
      url: '/test-app-start',
      referrer: 'https://sonaku.vip',
      platform: 'nodejs',
      userInfo: {
        uid: 'test-node-user'
      }
    });
    console.log('✅ App start tracking successful\n');
    
    // Test 2: Page view
    console.log('2. Testing page view tracking...');
    await testInstance.trackPageView({
      name: 'Test Node.js Page',
      url: '/test-page',
      userInfo: {
        uid: 'test-node-user'
      }
    });
    console.log('✅ Page view tracking successful\n');
    
    // Test 3: Event tracking
    console.log('3. Testing event tracking...');
    await testInstance.trackEvent({
      category: 'Node.js Test',
      action: 'Test Action',
      name: 'Test Event',
      value: 100,
      campaign: 'nodejs-test-2024',
      userInfo: {
        uid: 'test-node-user'
      }
    });
    console.log('✅ Event tracking successful\n');
    
    // Test 4: Custom action
    console.log('4. Testing custom action...');
    await testInstance.trackAction({
      name: 'Custom Node.js Action',
      url: '/custom-action'
    });
    console.log('✅ Custom action tracking successful\n');
    
    console.log('🎉 All basic tests passed!');
    console.log('\n📊 Check your Matomo dashboard at: https://matomo.sonaku.vip');
    console.log('   Site ID: 3');
    console.log('   Look for events from user: test-node-user');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

// Run the test
runBasicTest();