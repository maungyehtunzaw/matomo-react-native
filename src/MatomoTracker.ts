import {
  MatomoInitOptions,
  MatomoUserInfo,
  MatomoTrackAppStartOptions,
  MatomoTrackPageViewOptions,
  MatomoTrackScreenViewOptions,
  MatomoTrackActionOptions,
  MatomoTrackEventOptions,
  MatomoTrackContentOptions,
  MatomoTrackSiteSearchOptions,
  MatomoTrackLinkOptions,
  MatomoTrackDownloadOptions,
  MatomoTrackReferralUrlOptions,
  MatomoTrackAdClickOptions,
  MatomoTrackAdImpressionOptions,
  getPlatformInfo,
  generateUserAgent
} from './types';

/**
 * Represents a Matomo Tracker for tracking user interactions.
 *
 * @class
 * @param {MatomoInitOptions} userOptions - User configuration options for Matomo tracking.
 */
class MatomoTracker {
  private disabled: boolean = false;
  private log: boolean = false;
  private trackerUrl: string = '';
  private siteId: number = 0;
  private userId?: string;
  private userInfo: MatomoUserInfo = {};

  constructor(userOptions: MatomoInitOptions) {
    if (!userOptions.urlBase) {
      throw new Error('urlBase is required for Matomo tracking.');
    }
    if (!userOptions.siteId) {
      throw new Error('siteId is required for Matomo tracking.');
    }

    this.initialize(userOptions);
  }

  /**
   * Initializes the MatomoTracker with user options.
   *
   * @param {MatomoInitOptions} options - Initialization options.
   */
  initialize({ urlBase, trackerUrl, siteId, userId, disabled = false, log = false }: MatomoInitOptions): void {
    const normalizedUrlBase = urlBase[urlBase.length - 1] !== '/' ? `${urlBase}/` : urlBase;

    this.disabled = disabled;
    this.log = log;

    if (disabled) {
      log && console.log('Matomo tracking is disabled.');
      return;
    }

    this.trackerUrl = trackerUrl ?? `${normalizedUrlBase}matomo.php`;
    this.siteId = siteId;
    this.userInfo = {};

    if (userId) {
      this.userId = userId;
    }

    log &&
      console.log('Matomo tracking is enabled for:', {
        trackerUrl: this.trackerUrl,
        siteId: this.siteId,
        userId: this.userId
      });
  }

  /**
   * Tracks app start as an action with a prefixed 'App' category.
   * Automatically detects platform using React Native Platform.OS when available.
   *
   * @param {MatomoTrackAppStartOptions} options - Tracking options.
   * @returns {Promise<void>} A Promise that resolves when the tracking is complete.
   *
   * @example
   * // Basic app start tracking with automatic platform detection
   * trackAppStart();
   *
   * @example
   * // App start with custom referrer and URL
   * trackAppStart({ 
   *   url: '/app-start', 
   *   referrer: 'https://mywebsite.com',
   *   platform: 'ios' 
   * });
   *
   * @see https://developer.matomo.org/api-reference/tracking-api#optional-user-info for optional data used for tracking different user info
   */
  trackAppStart({ url, referrer, platform, userAgent, userInfo = {} }: MatomoTrackAppStartOptions = {}): Promise<void> {
    this.updateUserInfo(userInfo);

    // Get platform info for automatic detection
    const platformInfo = getPlatformInfo();
    const detectedPlatform = platform || platformInfo.os;

    // Build tracking data with Matomo API parameters
    const trackingData: Record<string, any> = {
      action_name: 'App / start',
      url: url || 'https://app/start', // Default URL if not provided
    };

    // Add referrer URL (urlref parameter in Matomo API)
    if (referrer) {
      trackingData.urlref = referrer;
    }

    // Generate or use provided user agent string for platform detection
    if (userAgent) {
      trackingData.ua = userAgent;
    } else {
      // Will be added by addCommonParameters with platform detection
      trackingData.ua = generateUserAgent({ 
        os: detectedPlatform as any, 
        version: platformInfo.version 
      });
    }

    return this.track(trackingData);
  }

  /**
   * Tracks a page view.
   *
   * This method is used to record page views in your application, providing insights into user navigation.
   *
   * @param {MatomoTrackPageViewOptions} options - Options for tracking the page view.
   * @returns {Promise<void>} A Promise that resolves when the page view tracking is complete.
   *
   * @example
   * // Tracking a page view
   * trackPageView({ name: 'Home Page', url: '/home' });
   *
   * @example
   * // Tracking a page view with user information
   * trackPageView({ name: 'Product Details', url: '/product/123', userInfo: { uid: '123456' } });
   */
  trackPageView({ name, url, userInfo = {} }: MatomoTrackPageViewOptions): Promise<void> {
    this.updateUserInfo(userInfo);

    return this.track({ action_name: name, url });
  }

  /**
   * Tracks a screen view as an action with the prefixed 'Screen' category.
   *
   * This method is used to record user interactions with screens or pages in your application.
   *
   * @param {MatomoTrackScreenViewOptions} options - Options for tracking the screen view.
   * @throws {Error} Throws an error if the 'name' parameter is not provided.
   * @returns {Promise<void>} A Promise that resolves when the screen view tracking is complete.
   *
   * @example
   * // Tracking a screen view without user information
   * trackScreenView({ name: 'Home' });
   *
   * @example
   * // Tracking a screen view with additional user information
   * trackScreenView({ name: 'Product Details', userInfo: { uid: '123456' } });
   */
  trackScreenView({ name, url, userInfo = {} }: MatomoTrackScreenViewOptions): Promise<void> {
    if (!name) {
      throw new Error('Error: The "name" parameter is required for tracking a screen view.');
    }
    this.updateUserInfo(userInfo);

    return this.trackAction({ name: `Screen / ${name}`, url });
  }

  /**
   * Tracks a custom action.
   *
   * This method is used to record user interactions with specific actions in your application.
   *
   * @param {MatomoTrackActionOptions} options - Options for tracking the action.
   * @throws {Error} Throws an error if the 'name' parameter is not provided.
   * @returns {Promise<void>} A Promise that resolves when the action tracking is complete.
   *
   * @example
   * // Tracking a custom action without user information
   * trackAction({ name: 'ButtonClick' });
   *
   * @example
   * // Tracking a custom action with additional user information
   * trackAction({ name: 'AddToCart', userInfo: { uid: '123456'} });
   *
   * @see {@link https://developer.matomo.org/api-reference/tracking-api#recommended-parameters|Matomo Tracking API - Recommended Parameters}
   */
  trackAction({ name, url, userInfo = {} }: MatomoTrackActionOptions): Promise<void> {
    if (!name) {
      throw new Error('Error: The "name" parameter is required for tracking an action.');
    }
    this.updateUserInfo(userInfo);

    // Ensure URL is always provided (will be auto-generated if not provided)
    return this.track({ action_name: name, url: url || undefined });
  }

  /**
   * Tracks a custom event.
   *
   * This method is used to record specific events in your application, providing insights into user interactions.
   *
   * @param {MatomoTrackEventOptions} options - Options for tracking the event.
   * @throws {Error} Throws an error if the 'category' or 'action' parameters are not provided.
   * @returns {Promise<void>} A Promise that resolves when the event tracking is complete.
   *
   * @example
   * // Tracking a basic event without additional information
   * trackEvent({ category: 'Videos', action: 'Play' });
   *
   * @example
   * // Tracking an event with a name and user information
   * trackEvent({ category: 'Music', action: 'Pause', name: 'FavoriteSong', userInfo: { uid: '123456'} });
   *
   * @see {@link https://developer.matomo.org/api-reference/tracking-api#optional-event-trackinghttpsmatomoorgdocsevent-tracking-info|Matomo Tracking API - Event Tracking}
   */
  trackEvent({ category, action, name, value, campaign, url, userInfo = {} }: MatomoTrackEventOptions): Promise<void> {
    if (!category) {
      throw new Error('Error: The "category" parameter is required for tracking an event.');
    }
    if (!action) {
      throw new Error('Error: The "action" parameter is required for tracking an event.');
    }
    this.updateUserInfo(userInfo);

    return this.track({
      e_c: category,
      e_a: action,
      e_n: name,
      e_v: value,
      mtm_campaign: campaign,
      url,
    });
  }

  /**
   * Tracks a custom content.
   *
   * This method is used to record specific content impressions or interactions in your application, providing insights into user interactions.
   *
   * @param {MatomoTrackContentOptions} options - Options for tracking the content.
   * @throws {Error} Throws an error if the 'name' is not provided.
   * @returns {Promise<void>} A Promise that resolves when the content tracking is complete.
   *
   * @example
   * // Tracking a basic content impression
   * trackContent({ name: "preview-liveboard", piece: "Malaysia", target: "https://dummy.matomo.org/liveboard/malaysia") });
   *
   * @example
   * // Tracking a content interaction with user information
   * trackContent({ name: "preview-liveboard", interaction: "tap", piece: "Malaysia", target: "https://dummy.matomo.org/liveboard/malaysia", userInfo: { uid: '123456'} });
   *
   * @see {@link https://developer.matomo.org/api-reference/tracking-api#optional-content-trackinghttpsmatomoorgdocscontent-tracking-info|Matomo Tracking API - Content Tracking}
   */
  trackContent({ contentName, contentPiece, contentTarget, contentInteraction, url, userInfo = {} }: MatomoTrackContentOptions): Promise<void> {
    if (!contentName) {
      throw new Error('Error: The "contentName" parameter is required for tracking a content.');
    }
    this.updateUserInfo(userInfo);

    const trackData: Record<string, any> = {
      c_n: contentName,
      c_p: contentPiece,
      c_t: contentTarget,
      url,
    };

    // Add interaction if provided (for tracking clicks/interactions)
    if (contentInteraction) {
      trackData.c_i = contentInteraction;
    }

    return this.track(trackData);
  }

  /**
   * Tracks a site search.
   *
   * This method is used to record user searches on your site, providing valuable insights into user behavior.
   *
   * @param {MatomoTrackSiteSearchOptions} options - Options for tracking the site search.
   * @throws {Error} Throws an error if the 'keyword' parameter is not provided.
   * @returns {Promise<void>} A Promise that resolves when the site search tracking is complete.
   *
   * @example
   * // Tracking a site search without additional information
   * trackSiteSearch({ keyword: 'product' });
   *
   * @example
   * // Tracking a site search with a category, result count, and user information
   * trackSiteSearch({ keyword: 'tutorial', category: 'Learning', count: 5, userInfo: { uid: '123456' } });
   *
   * @see {@link https://developer.matomo.org/api-reference/tracking-api#optional-action-info-measure-page-view-outlink-download-site-search|Matomo Tracking API - Site Search Tracking}
   */
  trackSiteSearch({ keyword, category, count, url, userInfo = {} }: MatomoTrackSiteSearchOptions): Promise<void> {
    if (!keyword) {
      throw new Error('Error: The "keyword" parameter is required for tracking a site search.');
    }
    this.updateUserInfo(userInfo);

    return this.track({
      search: keyword,
      search_cat: category,
      search_count: count,
      url,
    });
  }

  /**
   * Tracks clicks on outgoing links.
   *
   * This method is used to record user interactions when clicking on external links, providing insights into user navigation patterns.
   *
   * @param {MatomoTrackLinkOptions} options - Options for tracking the link click.
   * @throws {Error} Throws an error if the 'link' parameter is not provided.
   * @returns {Promise<void>} A Promise that resolves when the link click tracking is complete.
   *
   * @example
   * // Tracking a link click without additional information
   * trackLink({ link: 'https://external-site.com' });
   *
   * @example
   * // Tracking a link click with user information
   * trackLink({ link: 'https://external-site.com', userInfo: { userId: '123456', userRole: 'visitor' } });
   *
   * @see {@link https://developer.matomo.org/api-reference/tracking-api#optional-action-info-measure-page-view-outlink-download-site-search|Matomo Tracking API - Outlink Tracking}
   */
  trackLink({ link, url, userInfo = {} }: MatomoTrackLinkOptions): Promise<void> {
    if (!link) {
      throw new Error('Error: The "link" parameter is required for tracking a link click.');
    }
    this.updateUserInfo(userInfo);

    return this.track({ link, url });
  }

  /**
   * Tracks file downloads.
   *
   * This method is used to record user interactions when downloading files, providing insights into user engagement with downloadable content.
   *
   * @param {MatomoTrackDownloadOptions} options - Options for tracking the file download.
   * @throws {Error} Throws an error if the 'download' parameter is not provided.
   * @returns {Promise<void>} A Promise that resolves when the download tracking is complete.
   *
   * @example
   * // Tracking a file download without additional information
   * trackDownload({ download: 'https://example.com/files/document.pdf' });
   *
   * @example
   * // Tracking a file download with user information
   * trackDownload({ download: 'https://example.com/files/image.png', userInfo: { uid: '123456' } });
   *
   * @see {@link https://developer.matomo.org/api-reference/tracking-api#optional-action-info-measure-page-view-outlink-download-site-search|Matomo Tracking API - Download Tracking}
   */
  trackDownload({ download, url, userInfo = {} }: MatomoTrackDownloadOptions): Promise<void> {
    if (!download) {
      throw new Error('Error: The "download" parameter is required for tracking a file download.');
    }
    this.updateUserInfo(userInfo);

    return this.track({ download, url });
  }

  /**
   * This method is used to update the user information for tracking for entire instance.
   */
  updateUserInfo(newUserInfo: MatomoUserInfo): void {
    this.userInfo = { ...this.userInfo, ...newUserInfo };
  }

  /**
   * This method is used to remove the user information for tracking for entire instance.
   */
  removeUserInfo(): void {
    this.userInfo = {};
  }

  /**
   * Tracks a referral URL for attribution tracking.
   * 
   * This convenience method tracks where users came from by recording referral information
   * as an event with proper campaign attribution.
   *
   * @param {MatomoTrackReferralUrlOptions} options - Options for tracking the referral.
   * @returns {Promise<void>} A Promise that resolves when the referral tracking is complete.
   *
   * @example
   * // Track a referral from social media
   * trackReferralUrl({
   *   referralUrl: 'https://facebook.com/post/123',
   *   source: 'facebook',
   *   medium: 'social',
   *   campaign: 'summer-2024'
   * });
   */
  trackReferralUrl({ referralUrl, campaign, source, medium, url, userInfo = {} }: MatomoTrackReferralUrlOptions): Promise<void> {
    this.updateUserInfo(userInfo);

    return this.trackEvent({
      category: 'Referral',
      action: 'Visit',
      name: source || new URL(referralUrl).hostname,
      campaign: campaign,
      url: url,
      userInfo: {
        ...userInfo,
        urlref: referralUrl,
        // Store referral info in custom data if needed
        referralSource: source,
        referralMedium: medium
      }
    });
  }

  /**
   * Tracks an advertisement click.
   * 
   * Uses Matomo's content tracking to record when users click on advertisements,
   * providing insights into ad performance and user engagement.
   *
   * @param {MatomoTrackAdClickOptions} options - Options for tracking the ad click.
   * @returns {Promise<void>} A Promise that resolves when the ad click tracking is complete.
   *
   * @example
   * // Track a banner ad click
   * trackAdClick({
   *   adId: 'banner-001',
   *   adName: 'Summer Sale Banner',
   *   adSource: 'homepage',
   *   adCampaign: 'summer-2024',
   *   targetUrl: 'https://example.com/sale'
   * });
   */
  trackAdClick({ adId, adName, adSource, adCampaign, targetUrl, url, userInfo = {} }: MatomoTrackAdClickOptions): Promise<void> {
    this.updateUserInfo(userInfo);

    return this.trackContent({
      contentName: `Ad: ${adName}`,
      contentPiece: adId,
      contentTarget: targetUrl || '',
      contentInteraction: 'click',
      url: url,
      userInfo: {
        ...userInfo,
        adSource,
        adCampaign
      }
    });
  }

  /**
   * Tracks an advertisement impression (view).
   * 
   * Records when an advertisement is displayed to users, helping measure
   * ad visibility and reach.
   *
   * @param {MatomoTrackAdImpressionOptions} options - Options for tracking the ad impression.
   * @returns {Promise<void>} A Promise that resolves when the ad impression tracking is complete.
   *
   * @example
   * // Track a banner ad impression
   * trackAdImpression({
   *   adId: 'banner-001',
   *   adName: 'Summer Sale Banner',
   *   adSource: 'homepage',
   *   adCampaign: 'summer-2024'
   * });
   */
  trackAdImpression({ adId, adName, adSource, adCampaign, url, userInfo = {} }: MatomoTrackAdImpressionOptions): Promise<void> {
    this.updateUserInfo(userInfo);

    return this.trackContent({
      contentName: `Ad: ${adName}`,
      contentPiece: adId,
      contentTarget: '',
      url: url,
      userInfo: {
        ...userInfo,
        adSource,
        adCampaign
      }
    });
  }

  /**
   * Adds common Matomo tracking parameters to improve tracking accuracy
   */
  private addCommonParameters(data: Record<string, any>): Record<string, any> {
    const enhancedData = { ...data };

    // Ensure URL is always absolute (required by Matomo API)
    // Matomo requires "The full URL for the current action" - relative URLs are rejected
    if (!enhancedData.url) {
      // No URL provided - generate from action name
      const actionName = enhancedData.action_name || 'app';
      enhancedData.url = `https://app/${actionName.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`;
    } else if (!enhancedData.url.startsWith('http://') && !enhancedData.url.startsWith('https://')) {
      // Relative URL provided - convert to absolute
      const path = enhancedData.url.startsWith('/') ? enhancedData.url : `/${enhancedData.url}`;
      enhancedData.url = `https://app${path}`;
    }

    // Add random parameter to avoid caching (recommended by Matomo API)
    if (!enhancedData.rand) {
      enhancedData.rand = Math.floor(Math.random() * 1000000);
    }

    // Add current timestamp for better tracking accuracy
    if (!enhancedData.h && !enhancedData.m && !enhancedData.s) {
      const now = new Date();
      enhancedData.h = now.getHours();
      enhancedData.m = now.getMinutes();
      enhancedData.s = now.getSeconds();
    }

    // Add platform user agent if not already present
    if (!enhancedData.ua) {
      enhancedData.ua = generateUserAgent();
    }

    return enhancedData;
  }

  /**
   * Sends the tracking data to Matomo.
   *
   * @param {Record<string, any>} data - The tracking data.
   * @returns {Promise<void>} A Promise that resolves when the tracking data is sent.
   */
  private track(data: Record<string, any>): Promise<void> {
    if (this.disabled) return Promise.resolve();
    if (!data) return Promise.resolve();

    // Add common parameters for better tracking
    const enhancedData = this.addCommonParameters(data);

    // take a possibly given language and delete it from the data object, as we need to pass it in
    // the headers instead of body params. otherwise it would overwrite the 'Accept-Language' value.
    const lang = enhancedData.lang;
    delete enhancedData.lang;

    // Convert all values to strings for URLSearchParams
    const params: Record<string, string> = {
      idsite: this.siteId.toString(),
      rec: '1',
      apiv: '1',
      send_image: '0',
    };

    // Add userId if present
    if (this.userId) {
      params.uid = this.userId;
    }

    // Add data parameters, converting values to strings
    Object.keys(enhancedData).forEach(key => {
      if (enhancedData[key] !== undefined && enhancedData[key] !== null) {
        params[key] = String(enhancedData[key]);
      }
    });

    // Add userInfo parameters, converting values to strings
    Object.keys(this.userInfo).forEach(key => {
      if (this.userInfo[key] !== undefined && this.userInfo[key] !== null) {
        params[key] = String(this.userInfo[key]);
      }
    });
    Object.keys(this.userInfo).forEach(key => {
      if (this.userInfo[key] !== undefined && this.userInfo[key] !== null) {
        params[key] = String(this.userInfo[key]);
      }
    });

    const fetchObj: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Language': lang,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: new URLSearchParams(params).toString()
    };

    return fetch(this.trackerUrl, fetchObj)
      .then((response: Response) => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        this.log && console.log('Matomo tracking is sent:', this.trackerUrl, fetchObj);

        return;
      })
      .catch((error: any) => {
        this.log && console.log('Matomo tracking is not sent:', this.trackerUrl, fetchObj);

        console.warn('Matomo tracking error:', error);

        throw error;
      });
  }
}

export default MatomoTracker;