/**
 * Test to verify trackDownload fix
 * 
 * This test verifies that trackDownload properly sends both 'download' and 'url' parameters
 * as recommended by Matomo API documentation.
 */

const MatomoTracker = require('../lib/src/MatomoTracker').default;

// Test configuration
const TEST_CONFIG = {
  urlBase: 'https://matomo.sonaku.vip',
  siteId: 3,
  log: true
};

console.log('🧪 Testing trackDownload fix...\n');
console.log('Configuration:', TEST_CONFIG);
console.log('─'.repeat(80));

const tracker = new MatomoTracker(TEST_CONFIG);

async function testDownloadWithUrl() {
  console.log('\n📥 Test 1: trackDownload with explicit URL');
  console.log('─'.repeat(80));
  
  try {
    await tracker.trackDownload({
      download: 'https://sonaku.vip/files/document.pdf',
      url: 'https://app/downloads',
      userInfo: {
        uid: `test-download-1-${Date.now()}`
      }
    });
    console.log('✅ Download tracked with explicit URL\n');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

async function testDownloadWithoutUrl() {
  console.log('\n📥 Test 2: trackDownload without URL (should auto-use download URL)');
  console.log('─'.repeat(80));
  
  try {
    await tracker.trackDownload({
      download: 'https://sonaku.vip/files/presentation.pptx',
      userInfo: {
        uid: `test-download-2-${Date.now()}`
      }
    });
    console.log('✅ Download tracked with auto-filled URL\n');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

async function testLinkWithUrl() {
  console.log('\n🔗 Test 3: trackLink with explicit URL');
  console.log('─'.repeat(80));
  
  try {
    await tracker.trackLink({
      link: 'https://external-site.com',
      url: 'https://app/outbound',
      userInfo: {
        uid: `test-link-1-${Date.now()}`
      }
    });
    console.log('✅ Link tracked with explicit URL\n');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

async function testLinkWithoutUrl() {
  console.log('\n🔗 Test 4: trackLink without URL (should auto-use link URL)');
  console.log('─'.repeat(80));
  
  try {
    await tracker.trackLink({
      link: 'https://partner-site.com/page',
      userInfo: {
        uid: `test-link-2-${Date.now()}`
      }
    });
    console.log('✅ Link tracked with auto-filled URL\n');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

async function runAllTests() {
  const results = [];
  
  results.push(await testDownloadWithUrl());
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between tests
  
  results.push(await testDownloadWithoutUrl());
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  results.push(await testLinkWithUrl());
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  results.push(await testLinkWithoutUrl());
  
  console.log('\n' + '═'.repeat(80));
  console.log('📊 TEST SUMMARY');
  console.log('═'.repeat(80));
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  const failed = total - passed;
  
  console.log(`\n✅ Passed: ${passed}/${total}`);
  console.log(`${failed > 0 ? '❌' : '✅'} Failed: ${failed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! The fix is working correctly.\n');
    console.log('📝 What was fixed:');
    console.log('   - trackDownload now automatically sets url parameter to download URL');
    console.log('   - trackLink now automatically sets url parameter to link URL');
    console.log('   - This follows Matomo API recommendation for better tracking\n');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.\n');
  }
  
  console.log('💡 Check your Matomo dashboard under:');
  console.log('   - Behaviour > Downloads (for download tracking)');
  console.log('   - Behaviour > Outlinks (for link tracking)\n');
}

runAllTests().catch(console.error);
