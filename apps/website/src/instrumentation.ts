import * as Sentry from '@sentry/nextjs'

export async function register() {
	if (process.env.NODE_ENV === 'production') {
		// https://docs.sentry.io/platforms/javascript/guides/nextjs/
		Sentry.init({
			dsn: 'https://de5b08ff5e46343a42a477c195d00e50@o4509378229633024.ingest.de.sentry.io/4509378238546000',

			// Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
			tracesSampleRate: 1,

			// Setting this option to true will print useful information to the console while you're setting up Sentry.
			debug: false,

			enabled: !!process.env.SENTRY_AUTH_TOKEN,
		})
	}
}

export const onRequestError = Sentry.captureRequestError
