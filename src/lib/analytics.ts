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
 * Sends a custom event to Google Analytics.
 *
 * In development environments, this function will log the event to the console
 * instead of sending it to Google Analytics.
 *
 * @param eventName The name of the event to track.
 * @param params Optional parameters to associate with the event.
 */
export const track = (
  eventName: string,
  params?: Record<string, string | number | boolean>
) => {
  if (import.meta.env.MODE !== "production" || typeof window.gtag !== "function") {
    console.log(`[Analytics Event]: ${eventName}`, params);
    return;
  }
  window.gtag("event", eventName, params);
}; 