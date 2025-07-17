import { withSentryConfig } from '@sentry/nextjs'
import { withPayload } from '@payloadcms/next/withPayload'
import NextBundleAnalyzer from '@next/bundle-analyzer'
import type { NextConfig } from 'next'
import { withPlausibleProxy } from 'next-plausible'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const nextConfig = {
	output: 'standalone',
	distDir: 'dist',
	devIndicators: {
		position: 'bottom-right',
	},
	images: {
		remotePatterns: [
			...[NEXT_PUBLIC_SERVER_URL].map((item) => {
				const url = new URL(item)

				return {
					hostname: url.hostname,
					protocol: url.protocol.replace(':', '') as 'http' | 'https',
				}
			}),
		],
	},
	async redirects() {
		return [
			{
				source: '/login',
				destination: '/admin',
				permanent: true,
			},
			{
				source: '/analytics',
				destination: 'https://sherlock.apologetik-projekt.de/apologetik-projekt.de',
				permanent: false,
			},
		]
	},
} satisfies NextConfig

const withBundleAnalyzer = NextBundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
})

const withPlausible = withPlausibleProxy({
	customDomain: 'https://sherlock.apologetik-projekt.de',
	scriptName: 'p14u5ib1e',
})

export default withSentryConfig(
	withPlausible(withPayload(withBundleAnalyzer(nextConfig), { devBundleServerPackages: true })),
	{
		org: 'apologetik-projekt',
		project: 'website',
		authToken: process.env.SENTRY_AUTH_TOKEN,
		silent: !process.env.CI,
		widenClientFileUpload: true,
		tunnelRoute: '/monitoring',
		disableLogger: true,
		telemetry: false,
	},
)
