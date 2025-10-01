/**
 * Test runner for comprehensive Matomo tracking tests
 * Runs all tests with different unique users
 */

const MatomoTracker = require('../lib/src/MatomoTracker').default;

// Configuration
const MATOMO_URL = 'https://matomo.sonaku.vip';
const SITE_ID = 3;

// Create tracker instance
const tracker = new MatomoTracker({
  urlBase: MATOMO_URL,
  siteId: SITE_ID,
  log: true
});

// Helper to create unique user ID
const uniqueUserId = (prefix) => `${prefix}-${Date.now()}`;

// Test 1: Basic App Start
async function testBasicAppStart() {
  console.log('🧪 Test 1: Basic app start tracking...');
  try {
    await tracker.trackAppStart({
      userInfo: { uid: uniqueUserId('basic-user') }
    });
    console.log('✅ Test 1 passed\n');
    return true;
  } catch (error) {
    console.error('❌ Test 1 failed:', error.message, '\n');
    return false;
  }
}

// Test 2: Enhanced App Start with Platform Detection
async function testEnhancedAppStart() {
  console.log('🧪 Test 2: Enhanced app start with platform detection...');
  try {
    await tracker.trackAppStart({
      url: '/app-launch',
      referrer: 'https://sonaku.vip',
      platform: 'ios',
      userInfo: {
        uid: uniqueUserId('enhanced-user'),
        resolution: '1920x1080'
      }
    });
    console.log('✅ Test 2 passed\n');
    return true;
  } catch (error) {
    console.error('❌ Test 2 failed:', error.message, '\n');
    return false;
  }
}

// Test 3: Page View Tracking
async function testPageView() {
  console.log('🧪 Test 3: Page view tracking...');
  try {
    await tracker.trackPageView({
      name: 'Test Home Page',
      url: '/home',
      userInfo: { uid: uniqueUserId('pageview-user') }
    });
    console.log('✅ Test 3 passed\n');
    return true;
  } catch (error) {
    console.error('❌ Test 3 failed:', error.message, '\n');
    return false;
  }
}

// Test 4: Screen View Tracking
async function testScreenView() {
  console.log('🧪 Test 4: Screen view tracking...');
  try {
    await tracker.trackScreenView({
      name: 'Settings Screen',
      url: '/settings',
      userInfo: { uid: uniqueUserId('screen-user') }
    });
    console.log('✅ Test 4 passed\n');
    return true;
  } catch (error) {
    console.error('❌ Test 4 failed:', error.message, '\n');
    return false;
  }
}

// Test 5: Event Tracking with Campaign
async function testEventTracking() {
  console.log('🧪 Test 5: Event tracking with campaign...');
  try {
    await tracker.trackEvent({
      category: 'User Interaction',
      action: 'Button Click',
      name: 'Sign Up Button',
      value: 100,
      campaign: 'test-campaign-2024',
      url: '/signup',
      userInfo: { uid: uniqueUserId('event-user') }
    });
    console.log('✅ Test 5 passed\n');
    return true;
  } catch (error) {
    console.error('❌ Test 5 failed:', error.message, '\n');
    return false;
  }
}

// Test 6: Content Tracking
async function testContentTracking() {
  console.log('🧪 Test 6: Content tracking...');
  try {
    await tracker.trackContent({
      contentName: 'Homepage Banner',
      contentPiece: 'banner-promo.jpg',
      contentTarget: 'https://sonaku.vip/promo',
      userInfo: { uid: uniqueUserId('content-user') }
    });
    console.log('✅ Test 6 passed\n');
    return true;
  } catch (error) {
    console.error('❌ Test 6 failed:', error.message, '\n');
    return false;
  }
}

// Test 7: Site Search Tracking
async function testSiteSearch() {
  console.log('🧪 Test 7: Site search tracking...');
  try {
    await tracker.trackSiteSearch({
      keyword: 'react native tutorial',
      category: 'Documentation',
      count: 10,
      userInfo: { uid: uniqueUserId('search-user') }
    });
    console.log('✅ Test 7 passed\n');
    return true;
  } catch (error) {
    console.error('❌ Test 7 failed:', error.message, '\n');
    return false;
  }
}

// Test 8: Link Tracking
async function testLinkTracking() {
  console.log('🧪 Test 8: Outgoing link tracking...');
  try {
    await tracker.trackLink({
      link: 'https://external-website.com/partner',
      userInfo: { uid: uniqueUserId('link-user') }
    });
    console.log('✅ Test 8 passed\n');
    return true;
  } catch (error) {
    console.error('❌ Test 8 failed:', error.message, '\n');
    return false;
  }
}

// Test 9: Download Tracking
async function testDownloadTracking() {
  console.log('🧪 Test 9: Download tracking...');
  try {
    await tracker.trackDownload({
      download: 'https://sonaku.vip/files/whitepaper.pdf',
      userInfo: { uid: uniqueUserId('download-user') }
    });
    console.log('✅ Test 9 passed\n');
    return true;
  } catch (error) {
    console.error('❌ Test 9 failed:', error.message, '\n');
    return false;
  }
}

// Test 10: User Info Management
async function testUserInfoManagement() {
  console.log('🧪 Test 10: User info management...');
  try {
    const userId = uniqueUserId('managed-user');
    
    // Update user info
    tracker.updateUserInfo({
      uid: userId,
      resolution: '2560x1440',
      language: 'en-US'
    });
    
    // Track with updated info
    await tracker.trackAction({
      name: 'Profile / View',
      url: '/profile'
    });
    
    // Remove user info
    tracker.removeUserInfo();
    
    console.log('✅ Test 10 passed\n');
    return true;
  } catch (error) {
    console.error('❌ Test 10 failed:', error.message, '\n');
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Matomo Tracker Tests\n');
  console.log('=' .repeat(60));
  console.log(`Matomo URL: ${MATOMO_URL}`);
  console.log(`Site ID: ${SITE_ID}`);
  console.log('=' .repeat(60) + '\n');
  
  const tests = [
    testBasicAppStart,
    testEnhancedAppStart,
    testPageView,
    testScreenView,
    testEventTracking,
    testContentTracking,
    testSiteSearch,
    testLinkTracking,
    testDownloadTracking,
    testUserInfoManagement
  ];
  
  const results = [];
  
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    const result = await test();
    results.push(result);
    
    // Add delay between tests to avoid overwhelming the server
    if (i < tests.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  console.log('\n' + '=' .repeat(60));
  console.log(`📊 Test Results: ${passed}/${total} tests passed`);
  console.log('=' .repeat(60));
  
  if (passed === total) {
    console.log('🎉 All tests passed! Your Matomo tracker is working perfectly.');
    console.log(`\n✨ Check your dashboard at: ${MATOMO_URL}`);
    console.log(`   You should see ${total} different unique visitors`);
  } else {
    console.log(`⚠️  ${total - passed} test(s) failed. Check the logs above for details.`);
  }
  
  return { passed, total, success: passed === total };
}

// Execute tests
runAllTests()
  .then(results => {
    process.exit(results.success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n❌ Fatal error during test execution:', error);
    process.exit(1);
  });
