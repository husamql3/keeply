import * as Sentry from "@sentry/node";

export default () => {
	Sentry.init({
		dsn: process.env.VITE_SENTRY_DSN,
		environment: process.env.NODE_ENV,
		enabled: process.env.NODE_ENV === "production",
		tracesSampleRate: 1.0,
	});
};
