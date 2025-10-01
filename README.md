<img src="./matomo-tracker-react-native.png" width="350">

# Matomo React Native

![npm version](https://img.shields.io/npm/v/matomo-react-native.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-Compatible-green.svg)
![Expo](https://img.shields.io/badge/Expo-Compatible-black.svg)

**Enhanced TypeScript version** of the Matomo tracker for React Native and Expo projects with automatic platform detection and comprehensive Matomo API support.

## Credits

This package is based on the excellent work by [donni106/matomo-tracker-react-native](https://github.com/donni106/matomo-tracker-react-native). The original JavaScript implementation has been converted to TypeScript and enhanced with additional features including:

- 🔥 **Full TypeScript support** with comprehensive type definitions
- 📱 **Automatic platform detection** (iOS/Android/web) using `Platform.OS`
- 🌐 **Enhanced Matomo API compliance** with referrer tracking, user agents, and timestamps
- 🎯 **Simplified API** with all parameters optional and intelligent defaults
- 📊 **Production tested** against live Matomo instances

Special thanks to the original contributors and the foundation packages:
- [donni106/matomo-tracker-react-native](https://github.com/donni106/matomo-tracker-react-native) - Original React Native implementation
- [matomo-org/matomo-nodejs-tracker](https://github.com/matomo-org/matomo-nodejs-tracker) - Node.js foundation
- [Amsterdam/matomo-tracker](https://github.com/Amsterdam/matomo-tracker) - React foundation

## Why This Enhanced Version?

The original package provides excellent Matomo tracking for React Native. This enhanced version adds:
- **Zero configuration required** - works out of the box with automatic platform detection
- **Full TypeScript integration** - comprehensive interfaces and type safety
- **Enhanced tracking parameters** - automatic referrer detection, user agents, and platform-specific data
- **Modern development experience** - IntelliSense support and compile-time error checking

## Installation

```sh
npm install matomo-react-native
```

Or with yarn:
```sh
yarn add matomo-react-native
```

## Quick Start

```typescript
import React, { useEffect } from 'react';
import { View } from 'react-native';
import MatomoTracker, { MatomoProvider, useMatomo } from 'matomo-react-native';

// Create tracker instance
const tracker = new MatomoTracker({
  urlBase: 'https://your-matomo-domain.com',
  siteId: 1, // Your Matomo site ID
});

// Your main app component
const MainApp = () => {
  const { trackAppStart } = useMatomo();

  useEffect(() => {
    // Track app start - automatically detects platform (iOS/Android/web)
    trackAppStart();
  }, []);

  return <View>Your App Content</View>;
};

// Wrap your app with the provider
export const App = () => (
  <MatomoProvider instance={tracker}>
    <MainApp />
  </MatomoProvider>
);
```

That's it! The tracker will automatically detect the platform and send appropriate tracking data to your Matomo instance.

## Configuration Options

### MatomoTracker Constructor

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `urlBase` | `string` | ✅ | - | Your Matomo server domain (e.g., 'https://matomo.example.com') |
| `siteId` | `number` | ✅ | - | Your Matomo site ID |
| `trackerUrl` | `string` | ❌ | `${urlBase}matomo.php` | Custom tracker endpoint if different from default |
| `userId` | `string` | ❌ | `undefined` | Unique user identifier for cross-session tracking |
| `disabled` | `boolean` | ❌ | `false` | Disable all tracking when true |
| `log` | `boolean` | ❌ | `false` | Enable debug logging |

```typescript
const tracker = new MatomoTracker({
  urlBase: 'https://your-matomo.com',
  siteId: 1,
  userId: 'user123', // Optional: for user-specific tracking
  log: true, // Optional: enable debug logs
});
```

## Enhanced Features

### Automatic Platform Detection
The tracker automatically detects the platform and sends appropriate data:

```typescript
// Automatically detects iOS/Android/web and sends platform-specific data
await tracker.trackAppStart();

// Override platform detection if needed
await tracker.trackAppStart({
  platform: 'custom-platform',
  userAgent: 'CustomApp/1.0'
});
```

### Referrer Tracking
Enhanced support for referrer tracking:

```typescript
await tracker.trackAppStart({
  referrer: 'https://your-website.com'
});

await tracker.trackPageView({
  name: 'Home Screen',
  referrer: 'https://external-site.com'
});
```

### Type Safety with TypeScript
Full TypeScript support with comprehensive interfaces:

```typescript
import { MatomoTrackEventOptions, MatomoUserInfo } from 'matomo-react-native';

const eventData: MatomoTrackEventOptions = {
  category: 'User Interaction',
  action: 'Button Press',
  name: 'Sign Up Button',
  value: 1
};

const userInfo: MatomoUserInfo = {
  userId: 'user123',
  customData: { plan: 'premium' }
};
```

## API Reference

### useMatomo Hook

All tracking methods are available through the `useMatomo` hook:

```typescript
const {
  trackAppStart,
  trackPageView,
  trackEvent,
  trackAction,
  trackContent,
  trackSiteSearch,
  trackLink,
  trackDownload,
  updateUserInfo,
  removeUserInfo
} = useMatomo();
```

### trackAppStart(options?)

Tracks app start with automatic platform detection. **All parameters are optional.**

```typescript
// Simple usage - automatic platform detection
await trackAppStart();

// With custom options
await trackAppStart({
  url: '/home',
  referrer: 'https://mywebsite.com',
  platform: 'ios', // Will auto-detect if not provided
  userAgent: 'MyApp/1.0', // Will auto-generate if not provided
  userInfo: { userId: 'user123' }
});
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | `string` | Custom URL for the app start event |
| `referrer` | `string` | Referrer URL (urlref parameter) |
| `platform` | `string` | Platform override (auto-detected from Platform.OS) |
| `userAgent` | `string` | Custom user agent (auto-generated if not provided) |
| `userInfo` | `MatomoUserInfo` | Additional user information |

### trackPageView(options)

Tracks page/screen views with enhanced parameters:

```typescript
await trackPageView({
  name: 'Home Screen', // Required
  url: '/home',
  referrer: 'https://external-site.com',
  userInfo: { userId: 'user123' }
});
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | ✅ | Screen/page name |
| `url` | `string` | ❌ | Page URL |
| `referrer` | `string` | ❌ | Referrer URL |
| `userInfo` | `MatomoUserInfo` | ❌ | User information |

### trackEvent(options)

Tracks custom events:

```typescript
await trackEvent({
  category: 'User Interaction', // Required
  action: 'Button Press', // Required
  name: 'Sign Up Button',
  value: 1,
  url: '/signup',
  campaign: 'summer-promo',
  userInfo: { userId: 'user123' }
});
```

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `category` | `string` | ✅ | Event category |
| `action` | `string` | ✅ | Event action |
| `name` | `string` | ❌ | Event name |
| `value` | `number` | ❌ | Numeric event value |
| `url` | `string` | ❌ | Associated URL |
| `campaign` | `string` | ❌ | Campaign identifier |
| `userInfo` | `MatomoUserInfo` | ❌ | User information |

### trackAction(options)

Tracks general actions:

```typescript
await trackAction({
  name: 'Help / Contact Form', // Required - supports categories with /
  url: '/help/contact',
  userInfo: { userId: 'user123' }
});
```

### trackContent(options)

Tracks content impressions and interactions:

```typescript
await trackContent({
  name: 'Banner Ad', // Required
  piece: '/images/banner.jpg',
  target: 'https://example.com',
  interaction: 'click',
  url: '/home',
  userInfo: { userId: 'user123' }
});
```

### trackSiteSearch(options)

Tracks site search queries:

```typescript
await trackSiteSearch({
  keyword: 'react native', // Required
  category: 'documentation',
  count: 42,
  url: '/search',
  userInfo: { userId: 'user123' }
});
```

### trackLink(options) & trackDownload(options)

Track external links and downloads:

```typescript
await trackLink({
  link: 'https://external-site.com', // Required
  url: '/current-page'
});

await trackDownload({
  download: 'https://example.com/file.pdf', // Required
  url: '/downloads'
});
```

### User Information Management

```typescript
// Update user info
await updateUserInfo({
  userInfo: { userId: 'user123', customData: { plan: 'premium' } }
});

// Remove user info
await removeUserInfo();
```

## TypeScript Support

This package is written in TypeScript and provides comprehensive type definitions:

```typescript
import {
  MatomoTracker,
  MatomoProvider,
  useMatomo,
  MatomoUserInfo,
  MatomoTrackEventOptions,
  MatomoTrackPageViewOptions,
  MatomoTrackAppStartOptions,
  MatomoInitOptions
} from 'matomo-react-native';
```

### Type Definitions

```typescript
interface MatomoUserInfo {
  userId?: string;
  visitorId?: string;
  customData?: Record<string, any>;
  // ... additional user info fields
}

interface MatomoTrackEventOptions {
  category: string;
  action: string;
  name?: string;
  value?: number;
  url?: string;
  campaign?: string;
  userInfo?: MatomoUserInfo;
}

// All tracking options have comprehensive type definitions
```

## Platform Detection

The package automatically detects the platform using React Native's `Platform.OS`:

- **iOS**: Sends appropriate iOS user agents and platform identifiers
- **Android**: Sends Android-specific tracking data
- **Web**: Detects web platform when running in browser environments
- **Custom**: Allows manual override for custom platforms

```typescript
import { Platform } from 'react-native';

// Automatic detection
console.log(Platform.OS); // 'ios', 'android', 'web', etc.

// The tracker uses this automatically, but you can override:
await trackAppStart({
  platform: 'custom-platform',
  userAgent: 'MyCustomApp/1.0'
});
```

## Migration from Original Package

If you're migrating from `matomo-tracker-react-native`, the API is fully backward compatible:

1. Update your package.json:
```diff
- "matomo-tracker-react-native": "^0.3.3"
+ "matomo-react-native": "^1.0.0"
```

2. Update imports:
```diff
- import MatomoTracker, { MatomoProvider, useMatomo } from 'matomo-tracker-react-native';
+ import MatomoTracker, { MatomoProvider, useMatomo } from 'matomo-react-native';
```

3. Your existing tracking calls work unchanged:
```typescript
// This still works exactly the same
const { trackAppStart, trackEvent } = useMatomo();
await trackAppStart();
await trackEvent({ category: 'test', action: 'click' });
```

4. Optionally, take advantage of new features:
```typescript
// New enhanced features
await trackAppStart({
  referrer: 'https://mysite.com',
  platform: 'ios' // or let it auto-detect
});
```

## Examples

### Basic Setup
```typescript
import React from 'react';
import { App } from './App';
import MatomoTracker, { MatomoProvider } from 'matomo-react-native';

const tracker = new MatomoTracker({
  urlBase: 'https://your-matomo.com',
  siteId: 1
});

export default function AppWrapper() {
  return (
    <MatomoProvider instance={tracker}>
      <App />
    </MatomoProvider>
  );
}
```

### Navigation Tracking
```typescript
import { useMatomo } from 'matomo-react-native';
import { useEffect } from 'react';

function HomeScreen({ route }) {
  const { trackPageView } = useMatomo();
  
  useEffect(() => {
    trackPageView({
      name: 'Home Screen',
      url: route.name
    });
  }, []);
  
  return <YourHomeComponent />;
}
```

### Event Tracking
```typescript
function SignUpButton() {
  const { trackEvent } = useMatomo();
  
  const handlePress = async () => {
    await trackEvent({
      category: 'User Interaction',
      action: 'Button Press',
      name: 'Sign Up',
      value: 1
    });
    
    // Continue with your sign up logic
  };
  
  return <Button onPress={handlePress} title="Sign Up" />;
}
```

## Contributing

Contributions are welcome! This package builds upon the excellent foundation of the original `matomo-tracker-react-native`. 

Please see the original repository for contribution guidelines: [donni106/matomo-tracker-react-native](https://github.com/donni106/matomo-tracker-react-native)

## License

This package maintains the same license as the original project. See [LICENSE](./LICENSE) for details.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.

---

**Enhanced TypeScript version** | Based on [donni106/matomo-tracker-react-native](https://github.com/donni106/matomo-tracker-react-native) | Version 1.0.0
