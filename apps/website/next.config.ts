import { withPayload } from '@payloadcms/next/withPayload'
import NextBundleAnalyzer from '@next/bundle-analyzer'
import type { NextConfig } from 'next'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const nextConfig = {
	output: 'standalone',
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
				destination: 'https://anna.apologetik-projekt.de/apologetik-projekt.de',
				permanent: false,
			},
		]
	},
} satisfies NextConfig

const withBundleAnalyzer = NextBundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
})

export default withPayload(withBundleAnalyzer(nextConfig), { devBundleServerPackages: true })
