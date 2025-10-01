import { testInstance } from './test-config';

/**
 * Basic functionality tests for Matomo Tracker
 * Run these to verify the enhanced tracking features work correctly
 */

// Test 1: Basic App Start Tracking
export async function testBasicAppStart() {
  console.log('🧪 Testing basic app start tracking...');
  
  try {
    await testInstance.trackAppStart({
      userInfo: {
        uid: `test-user-basic-${Date.now()}`
      }
    });
    console.log('✅ Basic app start tracking successful');
    return true;
  } catch (error) {
    console.error('❌ Basic app start tracking failed:', error);
    return false;
  }
}

// Test 2: Enhanced App Start with Platform Detection
export async function testEnhancedAppStart() {
  console.log('🧪 Testing enhanced app start with platform detection...');
  
  try {
    await testInstance.trackAppStart({
      url: '/app-launch',
      referrer: 'https://sonaku.vip',
      platform: 'ios',
      userInfo: {
        uid: `test-user-enhanced-${Date.now()}`,
        resolution: '1920x1080'
      }
    });
    console.log('✅ Enhanced app start tracking successful');
    return true;
  } catch (error) {
    console.error('❌ Enhanced app start tracking failed:', error);
    return false;
  }
}

// Test 3: Page View Tracking
export async function testPageView() {
  console.log('🧪 Testing page view tracking...');
  
  try {
    await testInstance.trackPageView({
      name: 'Test Home Page',
      url: '/home',
      userInfo: {
        uid: `test-user-pageview-${Date.now()}`
      }
    });
    console.log('✅ Page view tracking successful');
    return true;
  } catch (error) {
    console.error('❌ Page view tracking failed:', error);
    return false;
  }
}

// Test 4: Screen View Tracking
export async function testScreenView() {
  console.log('🧪 Testing screen view tracking...');
  
  try {
    await testInstance.trackScreenView({
      name: 'Test Settings Screen',
      url: '/settings',
      userInfo: {
        uid: `test-user-screen-${Date.now()}`
      }
    });
    console.log('✅ Screen view tracking successful');
    return true;
  } catch (error) {
    console.error('❌ Screen view tracking failed:', error);
    return false;
  }
}

// Test 5: Event Tracking with Campaign
export async function testEventTracking() {
  console.log('🧪 Testing event tracking with campaign...');
  
  try {
    await testInstance.trackEvent({
      category: 'Test Category',
      action: 'Test Action',
      name: 'Test Event Name',
      value: 100,
      campaign: 'test-campaign-2024',
      url: '/test-event',
      userInfo: {
        uid: `test-user-event-${Date.now()}`
      }
    });
    console.log('✅ Event tracking successful');
    return true;
  } catch (error) {
    console.error('❌ Event tracking failed:', error);
    return false;
  }
}

// Test 6: Content Tracking
export async function testContentTracking() {
  console.log('🧪 Testing content tracking...');
  
  try {
    await testInstance.trackContent({
      contentName: 'Test Banner Ad',
      contentPiece: 'banner-homepage.jpg',
      contentTarget: 'https://sonaku.vip/promo',
      userInfo: {
        uid: `test-user-content-${Date.now()}`
      }
    });
    console.log('✅ Content tracking successful');
    return true;
  } catch (error) {
    console.error('❌ Content tracking failed:', error);
    return false;
  }
}

// Test 7: Site Search Tracking
export async function testSiteSearch() {
  console.log('🧪 Testing site search tracking...');
  
  try {
    await testInstance.trackSiteSearch({
      keyword: 'test search query',
      category: 'Test Category',
      count: 5,
      userInfo: {
        uid: `test-user-search-${Date.now()}`
      }
    });
    console.log('✅ Site search tracking successful');
    return true;
  } catch (error) {
    console.error('❌ Site search tracking failed:', error);
    return false;
  }
}

// Test 8: Link Tracking
export async function testLinkTracking() {
  console.log('🧪 Testing link tracking...');
  
  try {
    await testInstance.trackLink({
      link: 'https://external-link.com',
      userInfo: {
        uid: `test-user-link-${Date.now()}`
      }
    });
    console.log('✅ Link tracking successful');
    return true;
  } catch (error) {
    console.error('❌ Link tracking failed:', error);
    return false;
  }
}

// Test 9: Download Tracking
export async function testDownloadTracking() {
  console.log('🧪 Testing download tracking...');
  
  try {
    await testInstance.trackDownload({
      download: 'https://sonaku.vip/files/test-document.pdf',
      userInfo: {
        uid: `test-user-download-${Date.now()}`
      }
    });
    console.log('✅ Download tracking successful');
    return true;
  } catch (error) {
    console.error('❌ Download tracking failed:', error);
    return false;
  }
}

// Test 10: User Info Management
export async function testUserInfoManagement() {
  console.log('🧪 Testing user info management...');
  
  try {
    // Update user info
    testInstance.updateUserInfo({
      uid: `test-user-updated-${Date.now()}`,
      resolution: '2560x1440',
      language: 'en'
    });
    
    // Track an action with updated user info
    await testInstance.trackAction({
      name: 'Test Action with Updated User Info'
    });
    
    // Remove user info
    testInstance.removeUserInfo();
    
    console.log('✅ User info management successful');
    return true;
  } catch (error) {
    console.error('❌ User info management failed:', error);
    return false;
  }
}

// Run all tests
export async function runAllTests() {
  console.log('🚀 Starting Matomo Tracker Tests...\n');
  
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
  
  for (const test of tests) {
    const result = await test();
    results.push(result);
    console.log(''); // Add spacing between tests
    
    // Add delay between tests to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const passed = results.filter(Boolean).length;
  const total = results.length;
  
  console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Your Matomo tracker is working perfectly.');
  } else {
    console.log('⚠️ Some tests failed. Check the logs above for details.');
  }
  
  return { passed, total, success: passed === total };
}