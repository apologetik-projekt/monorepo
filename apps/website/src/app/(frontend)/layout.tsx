import type { Metadata } from 'next'
import React from 'react'
import config from '#/payload/payload.config'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '#/payload/utilities/getURL'
import Footer from '@/components/footer'
import MobileNavigation from '@/components/mobile-nav'
import Navigation from '@/components/navigation'
import { getPayload } from 'payload'
import { importFonts } from '@/styles/fonts'
import { Body } from '@/styles/layout.client'
import { ViewTransitions } from 'next-view-transitions'
import PlausibleProvider from 'next-plausible'
import './global.css'
importFonts()

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const payload = await getPayload({ config: config })
	const { navItems } = await payload.findGlobal({
		slug: 'navigation',
		depth: 1,
	})

	return (
		<ViewTransitions>
			<html lang="de" suppressHydrationWarning>
				<head>
					<meta name="theme-color" content="#000" />
					<link href="/favicon.ico" rel="icon" sizes="32x32" />
					<link href="/favicon.svg" rel="icon" type="image/svg+xml" />
				</head>
				<PlausibleProvider
					domain="beta.apologetik-projekt.de"
					customDomain="sherlock.apologetik-projekt.de"
					trackOutboundLinks
					selfHosted
				>
					<Body
						className={`group/route bg-gray-50 dark:data-supports-dark-mode:bg-[#0E0D0D] min-h-screen flex flex-col`}
						style={{ overflow: 'auto' }}
					>
						<MobileNavigation navigation={navItems} />
						<Navigation navigation={navItems} />
						{children}
						<Footer />
					</Body>
				</PlausibleProvider>
			</html>
		</ViewTransitions>
	)
}

export const metadata: Metadata = {
	metadataBase: new URL(getServerSideURL()),
	openGraph: mergeOpenGraph(),
}
