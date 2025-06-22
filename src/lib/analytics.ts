/**
 * Google Analytics event tracking.
 * 
 * This module provides a simple wrapper around the global `gtag` function
 * to send custom events to Google Analytics. It ensures that events are only
 * sent in production environments.
 * 
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs/events
 */

/**
 * Check if Google Analytics is properly loaded and available
 */
const isGoogleAnalyticsAvailable = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.gtag === 'function' && 
         Array.isArray(window.dataLayer);
};

/**
 * Sends a custom event to Google Analytics.
 *
 * In development environments, this function will log the event to the console
 * instead of sending it to Google Analytics.
 * In production, it will only send events if Google Analytics is properly loaded.
 *
 * @param eventName The name of the event to track.
 * @param params Optional parameters to associate with the event.
 */
export const track = (
  eventName: string,
  params?: Record<string, string | number | boolean>
) => {
  // Always log in development mode
  if (import.meta.env.MODE !== "production") {
    console.log(`[Analytics Event]: ${eventName}`, params);
    return;
  }

  // In production, check if GA is available before tracking
  if (!isGoogleAnalyticsAvailable()) {
    console.warn(`[Analytics]: Google Analytics not available for event: ${eventName}`);
    return;
  }

  try {
    window.gtag("event", eventName, params);
  } catch (error) {
    console.error(`[Analytics]: Failed to track event "${eventName}":`, error);
  }
};

/**
 * Initialize Google Analytics (called automatically when gtag is loaded)
 * This is mainly for debugging purposes to confirm GA is working
 */
export const initAnalytics = () => {
  if (isGoogleAnalyticsAvailable()) {
    console.log('[Analytics]: Google Analytics initialized successfully');
  } else {
    console.warn('[Analytics]: Google Analytics not properly loaded');
  }
};

/**
 * Track page views manually (useful for SPA navigation)
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  track('page_view', {
    page_path: pagePath,
    page_title: pageTitle || document.title,
  });
}; 