import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import MatomoTracker, { MatomoProvider, useMatomo, getPlatformInfo } from '../index';
import { testMatomoConfig } from './test-config';

// Create Matomo instance for the app
const matomoInstance = new MatomoTracker(testMatomoConfig);

// Test component using the useMatomo hook
const MatomoTestComponent: React.FC = () => {
  const {
    trackAppStart,
    trackPageView,
    trackScreenView,
    trackAction,
    trackEvent,
    trackContent,
    trackSiteSearch,
    trackLink,
    trackDownload,
    updateUserInfo,
    removeUserInfo
  } = useMatomo();

  const [testResults, setTestResults] = useState<string[]>([]);
  const [platformInfo, setPlatformInfo] = useState<any>(null);

  useEffect(() => {
    // Get platform information on component mount
    const platform = getPlatformInfo();
    setPlatformInfo(platform);
    
    // Track app start when component mounts
    trackAppStart?.({
      url: '/react-native-test',
      referrer: 'https://sonaku.vip',
      userInfo: {
        uid: 'rn-test-user'
      }
    });
  }, [trackAppStart]);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    try {
      addTestResult(`🧪 Running ${testName}...`);
      await testFn();
      addTestResult(`✅ ${testName} successful`);
    } catch (error) {
      addTestResult(`❌ ${testName} failed: ${error}`);
    }
  };

  const testBasicTracking = () => runTest('Basic Page View', async () => {
    await trackPageView?.({
      name: 'React Native Test Page',
      url: '/rn-test-page'
    });
  });

  const testScreenTracking = () => runTest('Screen View', async () => {
    await trackScreenView?.({
      name: 'Test Screen',
      url: '/test-screen',
      userInfo: { uid: 'screen-test-user' }
    });
  });

  const testEventTracking = () => runTest('Event Tracking', async () => {
    await trackEvent?.({
      category: 'React Native',
      action: 'Button Click',
      name: 'Test Button',
      value: 1,
      campaign: 'mobile-test-2024'
    });
  });

  const testActionTracking = () => runTest('Action Tracking', async () => {
    await trackAction?.({
      name: 'Custom Action Test',
      url: '/custom-action'
    });
  });

  const testContentTracking = () => runTest('Content Tracking', async () => {
    await trackContent?.({
      contentName: 'Mobile Banner',
      contentPiece: 'banner-mobile.jpg',
      contentTarget: 'https://sonaku.vip/mobile-promo'
    });
  });

  const testSearchTracking = () => runTest('Site Search', async () => {
    await trackSiteSearch?.({
      keyword: 'react native matomo',
      category: 'Mobile',
      count: 3
    });
  });

  const testLinkTracking = () => runTest('Link Tracking', async () => {
    await trackLink?.({
      link: 'https://github.com/matomo-org/matomo'
    });
  });

  const testDownloadTracking = () => runTest('Download Tracking', async () => {
    await trackDownload?.({
      download: 'https://sonaku.vip/app/mobile-app.apk'
    });
  });

  const testUserInfoUpdate = () => runTest('User Info Update', async () => {
    updateUserInfo?.({
      uid: 'updated-rn-user',
      resolution: '1080x1920',
      language: 'en-US'
    });
    
    await trackAction?.({
      name: 'Action with Updated User Info'
    });
  });

  const testUserInfoRemoval = () => runTest('User Info Removal', async () => {
    removeUserInfo?.();
    
    await trackAction?.({
      name: 'Action After User Info Removal'
    });
  });

  const runAllTests = async () => {
    setTestResults([]);
    addTestResult('🚀 Starting React Native Matomo Tests...');
    
    const tests = [
      testBasicTracking,
      testScreenTracking,
      testEventTracking,
      testActionTracking,
      testContentTracking,
      testSearchTracking,
      testLinkTracking,
      testDownloadTracking,
      testUserInfoUpdate,
      testUserInfoRemoval
    ];

    for (const test of tests) {
      await test();
      // Add small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    addTestResult('🎉 All React Native tests completed!');
    Alert.alert('Tests Completed', 'Check the console for detailed results');
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Matomo React Native Test App</Text>
      
      {platformInfo && (
        <View style={styles.platformInfo}>
          <Text style={styles.subtitle}>Platform Info:</Text>
          <Text style={styles.platformText}>OS: {platformInfo.os}</Text>
          {platformInfo.version && (
            <Text style={styles.platformText}>Version: {platformInfo.version}</Text>
          )}
        </View>
      )}
      
      <View style={styles.buttonContainer}>
        <Button title="Run All Tests" onPress={runAllTests} />
        <Button title="Clear Results" onPress={clearResults} color="#ff6b6b" />
      </View>
      
      <View style={styles.individualTests}>
        <Text style={styles.subtitle}>Individual Tests:</Text>
        <Button title="Page View" onPress={testBasicTracking} />
        <Button title="Screen View" onPress={testScreenTracking} />
        <Button title="Event" onPress={testEventTracking} />
        <Button title="Action" onPress={testActionTracking} />
        <Button title="Content" onPress={testContentTracking} />
        <Button title="Search" onPress={testSearchTracking} />
        <Button title="Link" onPress={testLinkTracking} />
        <Button title="Download" onPress={testDownloadTracking} />
        <Button title="Update User Info" onPress={testUserInfoUpdate} />
        <Button title="Remove User Info" onPress={testUserInfoRemoval} />
      </View>
      
      <View style={styles.resultsContainer}>
        <Text style={styles.subtitle}>Test Results:</Text>
        <ScrollView style={styles.results}>
          {testResults.map((result, index) => (
            <Text key={index} style={styles.resultText}>
              {result}
            </Text>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

// Main App component with Matomo Provider
const TestApp: React.FC = () => {
  return (
    <MatomoProvider instance={matomoInstance}>
      <MatomoTestComponent />
    </MatomoProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#555',
  },
  platformInfo: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  platformText: {
    fontSize: 14,
    color: '#1976d2',
    marginVertical: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  individualTests: {
    marginBottom: 20,
  },
  resultsContainer: {
    flex: 1,
    minHeight: 200,
  },
  results: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    maxHeight: 300,
  },
  resultText: {
    fontSize: 12,
    marginVertical: 2,
    fontFamily: 'monospace',
  },
});

export default TestApp;