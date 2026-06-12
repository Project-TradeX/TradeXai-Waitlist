import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  const token = process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
  
  if (token) {
    posthog.init(token, {
      api_host: host,
      persistence: 'localStorage',
      autocapture: true,
      capture_pageview: false, // page views are manually handled in useAnalytics.ts
    });
  } else {
    console.warn("PostHog Analytics: token is missing. Tracking events will be mocked.");
  }
}
