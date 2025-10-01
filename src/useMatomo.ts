import { useContext, useMemo } from 'react';
import { MatomoContext } from './MatomoProvider';
import { 
  MatomoHook, 
  MatomoTrackAppStartOptions,
  MatomoTrackPageViewOptions,
  MatomoTrackScreenViewOptions,
  MatomoTrackActionOptions,
  MatomoTrackEventOptions,
  MatomoTrackContentOptions,
  MatomoTrackSiteSearchOptions,
  MatomoTrackLinkOptions,
  MatomoTrackDownloadOptions,
  MatomoUserInfo
} from './types';

const useMatomo = (): MatomoHook => {
  const { instance } = useContext(MatomoContext);

  return useMemo(
    () => ({
      trackAppStart: (params?: MatomoTrackAppStartOptions) => instance?.trackAppStart(params),
      trackPageView: (params: MatomoTrackPageViewOptions) => instance?.trackPageView(params),
      trackScreenView: (params: MatomoTrackScreenViewOptions) => instance?.trackScreenView(params),
      trackAction: (params: MatomoTrackActionOptions) => instance?.trackAction(params),
      trackEvent: (params: MatomoTrackEventOptions) => instance?.trackEvent(params),
      trackContent: (params: MatomoTrackContentOptions) => instance?.trackContent(params),
      trackSiteSearch: (params: MatomoTrackSiteSearchOptions) => instance?.trackSiteSearch(params),
      trackLink: (params: MatomoTrackLinkOptions) => instance?.trackLink(params),
      trackDownload: (params: MatomoTrackDownloadOptions) => instance?.trackDownload(params),
      updateUserInfo: (params: MatomoUserInfo) => instance?.updateUserInfo(params),
      removeUserInfo: () => instance?.removeUserInfo(),
    //   trackReferralUrl: (params: MatomoTrackReferralUrlOptions) => instance?.trackReferralUrl(params),
    // trackAdClick: (params: MatomoTrackAdClickOptions) => instance?.trackAdClick(params),
    // trackAdImpression: (params: MatomoTrackAdImpressionOptions) => instance?.trackAdImpression(params),
    }),
    [instance]
  );
};

export default useMatomo;