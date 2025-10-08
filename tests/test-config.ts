import MatomoTracker from '../src/MatomoTracker';

// Test configuration using your Matomo instance
export const testMatomoConfig = {
  urlBase: 'https://matomo.sonaku.vip',
  siteId: 3,
  userId: 'test-user-' + Date.now(), // Dynamic test user ID
  log: true, // Enable logging for tests
  disabled: false
};


// Create test instance
export const createTestInstance = () => new MatomoTracker(testMatomoConfig);

// Test instance with logging enabled
export const testInstance = createTestInstance();