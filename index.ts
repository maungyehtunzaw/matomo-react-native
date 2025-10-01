import MatomoTracker from './src/MatomoTracker';
import MatomoProvider, { MatomoContext } from './src/MatomoProvider';
import useMatomo from './src/useMatomo';

export default MatomoTracker;
export { MatomoProvider, MatomoContext, useMatomo };
export * from './src/types';

// Export utility functions for platform detection
export { getPlatformInfo, generateUserAgent } from './src/types';