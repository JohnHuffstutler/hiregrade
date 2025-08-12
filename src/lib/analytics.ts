export function track(event: string, props?: Record<string, any>) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  // TODO: integrate PostHog browser SDK
  console.debug("track", event, props);
}
