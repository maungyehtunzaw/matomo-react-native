# Matomo Tracker Tests

This directory contains comprehensive tests for the Matomo React Native tracker using your production Matomo instance.

## Test Configuration

- **Matomo URL**: `https://matomo.sonaku.vip`
- **Site ID**: `3`
- **Test User**: Dynamic test users with timestamp prefixes

## Test Files

### 1. `test-config.ts`
Contains the Matomo configuration using your credentials.

### 2. `matomo-tests.ts`
Core test functions that validate all tracking functionality:

- ✅ **Basic App Start** - Simple app launch tracking
- ✅ **Enhanced App Start** - With platform detection, referrer, and custom params
- ✅ **Page View Tracking** - Web-style page tracking
- ✅ **Screen View Tracking** - Mobile screen navigation
- ✅ **Event Tracking** - With campaigns and custom values
- ✅ **Content Tracking** - Banner/content impression tracking
- ✅ **Site Search Tracking** - Search query tracking
- ✅ **Link Tracking** - External link clicks
- ✅ **Download Tracking** - File download tracking
- ✅ **User Info Management** - Update and remove user data

### 3. `TestApp.tsx`
React Native component for interactive testing:

- Platform detection display
- Individual test buttons
- Real-time results display
- Full integration with `useMatomo` hook

### 4. `run-tests.js`
Node.js test runner for automated testing.

## Running Tests

### Node.js Tests (Automated)
```bash
# Run all tests automatically
npm run test

# Or run with detailed output
npm run test:node
```

### React Native App Tests (Interactive)
1. Import the `TestApp` component in your React Native app
2. Wrap with `MatomoProvider`
3. Use the interactive test interface

```tsx
import TestApp from './tests/TestApp';

export default function App() {
  return <TestApp />;
}
```

## Test Features

### Platform Detection Testing
- ✅ Automatic React Native `Platform.OS` detection
- ✅ Web fallback detection
- ✅ Custom user agent generation
- ✅ Platform-specific tracking

### Enhanced Matomo API Support
- ✅ `urlref` - Referrer URL tracking
- ✅ `ua` - User Agent with platform info
- ✅ `rand` - Cache-busting random values
- ✅ `h`, `m`, `s` - Timestamp accuracy
- ✅ Campaign tracking parameters
- ✅ Custom user information

### Error Handling
- ✅ Network error handling
- ✅ Invalid parameter validation
- ✅ Graceful fallbacks
- ✅ Comprehensive logging

## Expected Results

When tests run successfully, you should see:

1. **Console Output**: Detailed test progress and results
2. **Matomo Dashboard**: New visits and events appearing in real-time
3. **Platform Detection**: Correct OS and device information
4. **Custom Parameters**: Referrer, campaign, and user data tracked

## Verifying in Matomo

After running tests, check your Matomo dashboard at `https://matomo.sonaku.vip`:

1. **Visitors > Real-time** - See live test activity
2. **Behaviour > Pages** - Verify page/screen tracking
3. **Behaviour > Events** - Check event tracking with campaigns
4. **Acquisition > Campaigns** - Verify campaign attribution
5. **Visitors > Devices** - Confirm platform detection

## Troubleshooting

### Network Issues
- Ensure `https://matomo.sonaku.vip` is accessible
- Check firewall/proxy settings
- Verify SSL certificate validity

### Missing Data
- Check Matomo site ID (should be `3`)
- Verify tracking is enabled in Matomo settings
- Check for JavaScript/content blockers

### Test Failures
- Review console output for specific errors
- Check network connectivity
- Verify Matomo server status

## Example Test Output

```
🚀 Starting Matomo Tracker Tests...

🧪 Testing basic app start tracking...
✅ Basic app start tracking successful

🧪 Testing enhanced app start with platform detection...
✅ Enhanced app start tracking successful

🧪 Testing page view tracking...
✅ Page view tracking successful

📊 Test Results: 10/10 tests passed
🎉 All tests passed! Your Matomo tracker is working perfectly.
```

## Integration Examples

### Basic Usage
```typescript
import MatomoTracker from 'matomo-tracker-react-native';

const tracker = new MatomoTracker({
  urlBase: 'https://matomo.sonaku.vip',
  siteId: 3
});

// Track app start with platform detection
await tracker.trackAppStart({
  referrer: 'https://mywebsite.com'
});
```

### React Native Hook
```tsx
import { useMatomo } from 'matomo-tracker-react-native';

function MyComponent() {
  const { trackScreenView } = useMatomo();
  
  useEffect(() => {
    trackScreenView({
      name: 'Home Screen',
      url: '/home'
    });
  }, []);
}
```