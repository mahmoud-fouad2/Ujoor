import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Environment
  environment: process.env.NODE_ENV || "development",

  // Ignore certain errors
  ignoreErrors: [
    // Browser extensions
    "Non-Error promise rejection captured",
    "ResizeObserver loop limit exceeded",
    "Extension context invalidated",
    // Network errors
    "NetworkError",
    "Network request failed",
    "Failed to fetch",
    "Load failed",
    // Cancelled requests
    "AbortError",
    "The operation was aborted",
  ],

  beforeSend(event, hint) {
    // Filter out sensitive data
    if (event.request) {
      delete event.request.cookies;
      
      // Remove sensitive headers
      if (event.request.headers) {
        delete event.request.headers.Authorization;
        delete event.request.headers.Cookie;
      }
    }

    // Add custom context
    if (event.user) {
      // Don't send email/name, only ID
      event.user = {
        id: event.user.id,
      };
    }

    return event;
  },
});
