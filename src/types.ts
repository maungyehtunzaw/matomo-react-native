// Core Matomo types and interfaces

export interface MatomoUserInfo {
  uid?: string;
  cip?: string;
  cdt?: string;
  cvar?: Record<string, [string, string]>;
  [key: string]: any;
}

// Platform detection utility
export interface PlatformInfo {
  os: 'ios' | 'android' | 'web' | 'windows' | 'macos' | 'unknown';
  version?: string;
}

// Enhanced user info with more Matomo API parameters
export interface MatomoEnhancedUserInfo extends MatomoUserInfo {
  resolution?: string; // res parameter - device resolution (e.g., "1280x1024")
  language?: string; // lang parameter - Accept-Language override
  timezone?: string; // Timezone information
  userAgent?: string; // ua parameter - User-Agent override
}

// Convenience type aliases for easier usage
export type UserInfo = MatomoUserInfo;
export type Action = MatomoTrackActionOptions;
export type Event = MatomoTrackEventOptions;
export type AppStart = MatomoTrackAppStartOptions;
export type PageView = MatomoTrackPageViewOptions;

export interface MatomoInitOptions {
  urlBase: string;
  siteId: number;
  trackerUrl?: string;
  userId?: string;
  disabled?: boolean;
  log?: boolean;
}

export interface MatomoTrackAppStartOptions {
  url?: string;
  referrer?: string; // urlref parameter in Matomo API
  platform?: string; // Will use Platform.OS if not provided
  userAgent?: string; // ua parameter for custom user agent
  userInfo?: MatomoUserInfo;
}

export interface MatomoTrackPageViewOptions {
  name: string;
  url: string;
  userInfo?: MatomoUserInfo;
}

export interface MatomoTrackScreenViewOptions {
  name: string;
  url?: string;
  userInfo?: MatomoUserInfo;
}

export interface MatomoTrackActionOptions {
  name: string;
  url?: string;
  userInfo?: MatomoUserInfo;
}

export interface MatomoTrackEventOptions {
  category: string;
  action: string;
  name?: string;
  value?: number;
  campaign?: string;
  url?: string;
  userInfo?: MatomoUserInfo;
}

export interface MatomoTrackContentOptions {
  contentName: string;
  contentPiece?: string;
  contentTarget?: string;
  url?: string;
  userInfo?: MatomoUserInfo;
}

export interface MatomoTrackSiteSearchOptions {
  keyword: string;
  category?: string;
  count?: number;
  url?: string;
  userInfo?: MatomoUserInfo;
}

export interface MatomoTrackLinkOptions {
  link: string;
  linkType?: 'link' | 'download';
  url?: string;
  userInfo?: MatomoUserInfo;
}

export interface MatomoTrackDownloadOptions {
  download: string;
  url?: string;
  userInfo?: MatomoUserInfo;
}

export interface MatomoTrackerInstance {
  trackAppStart: (options?: MatomoTrackAppStartOptions) => Promise<void>;
  trackPageView: (options: MatomoTrackPageViewOptions) => Promise<void>;
  trackScreenView: (options: MatomoTrackScreenViewOptions) => Promise<void>;
  trackAction: (options: MatomoTrackActionOptions) => Promise<void>;
  trackEvent: (options: MatomoTrackEventOptions) => Promise<void>;
  trackContent: (options: MatomoTrackContentOptions) => Promise<void>;
  trackSiteSearch: (options: MatomoTrackSiteSearchOptions) => Promise<void>;
  trackLink: (options: MatomoTrackLinkOptions) => Promise<void>;
  trackDownload: (options: MatomoTrackDownloadOptions) => Promise<void>;
  updateUserInfo: (userInfo: MatomoUserInfo) => void;
  removeUserInfo: () => void;
}

export interface MatomoHook {
  trackAppStart: (params?: MatomoTrackAppStartOptions) => Promise<void> | undefined;
  trackPageView: (params: MatomoTrackPageViewOptions) => Promise<void> | undefined;
  trackScreenView: (params: MatomoTrackScreenViewOptions) => Promise<void> | undefined;
  trackAction: (params: MatomoTrackActionOptions) => Promise<void> | undefined;
  trackEvent: (params: MatomoTrackEventOptions) => Promise<void> | undefined;
  trackContent: (params: MatomoTrackContentOptions) => Promise<void> | undefined;
  trackSiteSearch: (params: MatomoTrackSiteSearchOptions) => Promise<void> | undefined;
  trackLink: (params: MatomoTrackLinkOptions) => Promise<void> | undefined;
  trackDownload: (params: MatomoTrackDownloadOptions) => Promise<void> | undefined;
  updateUserInfo: (params: MatomoUserInfo) => void | undefined;
  removeUserInfo: () => void | undefined;
}

// Utility functions for platform detection
export const getPlatformInfo = (): PlatformInfo => {
  try {
    // Try to import Platform from react-native
    const Platform = require('react-native').Platform;
    return {
      os: Platform.OS as 'ios' | 'android' | 'web' | 'windows' | 'macos',
      version: Platform.Version?.toString()
    };
  } catch {
    // Fallback for web or non-React Native environments
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        return { os: 'ios' };
      } else if (userAgent.includes('android')) {
        return { os: 'android' };
      } else if (userAgent.includes('mac')) {
        return { os: 'macos' };
      } else if (userAgent.includes('win')) {
        return { os: 'windows' };
      } else {
        return { os: 'web' };
      }
    }
    return { os: 'unknown' };
  }
};

export const generateUserAgent = (platformInfo?: PlatformInfo): string => {
  const platform = platformInfo || getPlatformInfo();
  const appName = 'MatomoReactNative';
  const version = '1.0';
  
  switch (platform.os) {
    case 'ios':
      return `${appName}/${version} (iOS ${platform.version || 'Unknown'}; iPhone)`;
    case 'android':
      return `${appName}/${version} (Android ${platform.version || 'Unknown'}; Mobile)`;
    case 'web':
      return `${appName}/${version} (Web; Browser)`;
    case 'windows':
      return `${appName}/${version} (Windows; Desktop)`;
    case 'macos':
      return `${appName}/${version} (macOS; Desktop)`;
    default:
      return `${appName}/${version} (Unknown Platform)`;
  }
};