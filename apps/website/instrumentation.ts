import * as Sentry from '@sentry/nextjs'

export async function register() {
	if (process.env.NODE_ENV === 'production') {
		// https://docs.sentry.io/platforms/javascript/guides/nextjs/
		Sentry.init({
			dsn: process.env.SENTRY_DSN,
			tracesSampleRate: 1,
			debug: false,
			enabled: !!process.env.SENTRY_AUTH_TOKEN,
			integrations: [],
			sendClientReports: false,
			beforeSend(event) {
				if (event.user) {
					delete event.user.ip_address
				}
				return event
			},
		})
	}
}

export const onRequestError = Sentry.captureRequestError
