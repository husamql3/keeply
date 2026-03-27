import * as Sentry from "@sentry/react";

import { env } from "@/env";

if (typeof window !== "undefined") {
	Sentry.init({
		dsn: env.VITE_SENTRY_DSN,
		environment: import.meta.env.MODE,
		enabled: import.meta.env.PROD,
		sendDefaultPii: true,
		integrations: [
			Sentry.browserTracingIntegration(),
			Sentry.replayIntegration({
				maskAllText: false,
				blockAllMedia: false,
			}),
		],
		tracesSampleRate: 1.0,
		replaysSessionSampleRate: 0.1,
		replaysOnErrorSampleRate: 1.0,
		enableLogs: true,
	});
}
