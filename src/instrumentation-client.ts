if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  void import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 0.1,
      beforeSend(event) {
        event.request = undefined;
        event.extra = undefined;
        event.contexts = undefined;
        return event;
      },
      beforeBreadcrumb() {
        return null;
      },
    });
  });
}
export {};
