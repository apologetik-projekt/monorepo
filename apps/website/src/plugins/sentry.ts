import * as Sentry from '@sentry/nextjs'
import { sentryPlugin } from '@payloadcms/plugin-sentry'

export default sentryPlugin({ Sentry, enabled: !!process.env.SENTRY_AUTH_TOKEN })
