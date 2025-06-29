import { AnalyticsData } from '../Interfaces';

export const collectAnalyticsData = (): AnalyticsData => {
  return {
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    // eslint-disable-next-line no-restricted-globals
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
  };
};