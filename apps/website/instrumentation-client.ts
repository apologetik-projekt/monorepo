// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

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

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
