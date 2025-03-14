import { withPayload } from '@payloadcms/next/withPayload'

const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
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
					protocol: url.protocol.replace(':', ''),
				}
			}),
		],
	},
	redirects() {
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
}

export default withPayload(nextConfig, { devBundleServerPackages: true })
