/**
 * Tests for the three new convenience tracking methods:
 * - trackReferralUrl
 * - trackAdClick
 * - trackAdImpression
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

// Test 1: Track Referral URL
async function testTrackReferralUrl() {
  console.log('🧪 Test 1: Track referral URL...');
  try {
    await tracker.trackReferralUrl({
      referralUrl: 'https://facebook.com/post/12345',
      source: 'facebook',
      medium: 'social',
      campaign: 'winter-campaign-2024',
      url: '/landing-page',
      userInfo: { uid: uniqueUserId('referral-user') }
    });
    console.log('✅ Referral URL tracking successful\n');
    return true;
  } catch (error) {
    console.error('❌ Referral URL tracking failed:', error.message, '\n');
    return false;
  }
}

// Test 2: Track Referral URL (minimal params)
async function testTrackReferralUrlMinimal() {
  console.log('🧪 Test 2: Track referral URL (minimal parameters)...');
  try {
    await tracker.trackReferralUrl({
      referralUrl: 'https://twitter.com/status/67890',
      userInfo: { uid: uniqueUserId('referral-minimal') }
    });
    console.log('✅ Minimal referral URL tracking successful\n');
    return true;
  } catch (error) {
    console.error('❌ Minimal referral URL tracking failed:', error.message, '\n');
    return false;
  }
}

// Test 3: Track Ad Click
async function testTrackAdClick() {
  console.log('🧪 Test 3: Track ad click...');
  try {
    await tracker.trackAdClick({
      adId: 'banner-homepage-001',
      adName: 'Summer Sale Banner',
      adSource: 'homepage-top',
      adCampaign: 'summer-sale-2024',
      targetUrl: 'https://sonaku.vip/sale',
      url: '/home',
      userInfo: { uid: uniqueUserId('ad-click-user') }
    });
    console.log('✅ Ad click tracking successful\n');
    return true;
  } catch (error) {
    console.error('❌ Ad click tracking failed:', error.message, '\n');
    return false;
  }
}

// Test 4: Track Ad Click (minimal params)
async function testTrackAdClickMinimal() {
  console.log('🧪 Test 4: Track ad click (minimal parameters)...');
  try {
    await tracker.trackAdClick({
      adId: 'sidebar-ad-002',
      adName: 'Product Promotion',
      userInfo: { uid: uniqueUserId('ad-click-minimal') }
    });
    console.log('✅ Minimal ad click tracking successful\n');
    return true;
  } catch (error) {
    console.error('❌ Minimal ad click tracking failed:', error.message, '\n');
    return false;
  }
}

// Test 5: Track Ad Impression
async function testTrackAdImpression() {
  console.log('🧪 Test 5: Track ad impression...');
  try {
    await tracker.trackAdImpression({
      adId: 'banner-homepage-001',
      adName: 'Summer Sale Banner',
      adSource: 'homepage-top',
      adCampaign: 'summer-sale-2024',
      url: '/home',
      userInfo: { uid: uniqueUserId('ad-impression-user') }
    });
    console.log('✅ Ad impression tracking successful\n');
    return true;
  } catch (error) {
    console.error('❌ Ad impression tracking failed:', error.message, '\n');
    return false;
  }
}

// Test 6: Track Ad Impression (minimal params)
async function testTrackAdImpressionMinimal() {
  console.log('🧪 Test 6: Track ad impression (minimal parameters)...');
  try {
    await tracker.trackAdImpression({
      adId: 'footer-ad-003',
      adName: 'Newsletter Signup',
      userInfo: { uid: uniqueUserId('ad-impression-minimal') }
    });
    console.log('✅ Minimal ad impression tracking successful\n');
    return true;
  } catch (error) {
    console.error('❌ Minimal ad impression tracking failed:', error.message, '\n');
    return false;
  }
}

// Test 7: Track Multiple Ad Impressions (simulating banner rotation)
async function testMultipleAdImpressions() {
  console.log('🧪 Test 7: Track multiple ad impressions (banner rotation)...');
  try {
    const userId = uniqueUserId('ad-rotation-user');
    
    // Simulate viewing 3 different ads
    await tracker.trackAdImpression({
      adId: 'rotating-banner-001',
      adName: 'Product A Banner',
      adCampaign: 'product-launch',
      userInfo: { uid: userId }
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await tracker.trackAdImpression({
      adId: 'rotating-banner-002',
      adName: 'Product B Banner',
      adCampaign: 'product-launch',
      userInfo: { uid: userId }
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await tracker.trackAdImpression({
      adId: 'rotating-banner-003',
      adName: 'Product C Banner',
      adCampaign: 'product-launch',
      userInfo: { uid: userId }
    });
    
    console.log('✅ Multiple ad impressions tracking successful\n');
    return true;
  } catch (error) {
    console.error('❌ Multiple ad impressions tracking failed:', error.message, '\n');
    return false;
  }
}

// Test 8: Complete User Journey (Referral → Ad Impression → Ad Click)
async function testCompleteUserJourney() {
  console.log('🧪 Test 8: Complete user journey (Referral → Ad Impression → Ad Click)...');
  try {
    const userId = uniqueUserId('journey-user');
    
    // Step 1: User arrives via referral
    await tracker.trackReferralUrl({
      referralUrl: 'https://google.com/search?q=best+deals',
      source: 'google',
      medium: 'organic',
      userInfo: { uid: userId }
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Step 2: User sees ad
    await tracker.trackAdImpression({
      adId: 'promo-banner-001',
      adName: 'Black Friday Sale',
      adCampaign: 'black-friday-2024',
      userInfo: { uid: userId }
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Step 3: User clicks ad
    await tracker.trackAdClick({
      adId: 'promo-banner-001',
      adName: 'Black Friday Sale',
      adCampaign: 'black-friday-2024',
      targetUrl: 'https://sonaku.vip/black-friday',
      userInfo: { uid: userId }
    });
    
    console.log('✅ Complete user journey tracking successful\n');
    return true;
  } catch (error) {
    console.error('❌ Complete user journey tracking failed:', error.message, '\n');
    return false;
  }
}

// Run all tests
async function runNewFeatureTests() {
  console.log('🚀 Testing New Tracking Features\n');
  console.log('=' .repeat(60));
  console.log(`Matomo URL: ${MATOMO_URL}`);
  console.log(`Site ID: ${SITE_ID}`);
  console.log('=' .repeat(60) + '\n');
  
  const tests = [
    testTrackReferralUrl,
    testTrackReferralUrlMinimal,
    testTrackAdClick,
    testTrackAdClickMinimal,
    testTrackAdImpression,
    testTrackAdImpressionMinimal,
    testMultipleAdImpressions,
    testCompleteUserJourney
  ];
  
  const results = [];
  
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    const result = await test();
    results.push(result);
    
    // Add delay between tests
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
    console.log('🎉 All new feature tests passed!');
    console.log(`\n✨ Check your dashboard at: ${MATOMO_URL}`);
    console.log('   New tracking methods:');
    console.log('   ✅ trackReferralUrl - Track referral sources');
    console.log('   ✅ trackAdClick - Track advertisement clicks');
    console.log('   ✅ trackAdImpression - Track advertisement views');
  } else {
    console.log(`⚠️  ${total - passed} test(s) failed. Check the logs above for details.`);
  }
  
  return { passed, total, success: passed === total };
}

// Execute tests
runNewFeatureTests()
  .then(results => {
    process.exit(results.success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n❌ Fatal error during test execution:', error);
    process.exit(1);
  });
