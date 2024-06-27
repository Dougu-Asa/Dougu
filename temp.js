import * as Sentry from '@sentry/react-native';

// Use sentry to track and log errors throughout the app
Sentry.init({
  dsn: 'https://dc0105cfe4212e7f682ce47529bc0c51@o4507486458871808.ingest.us.sentry.io/4507486460051456',
  integrations: [
    new Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  _experiments: {
    // profilesSampleRate is relative to tracesSampleRate.
    // Here, we'll capture profiles for 100% of transactions.
    profilesSampleRate: 1.0,
  },
});