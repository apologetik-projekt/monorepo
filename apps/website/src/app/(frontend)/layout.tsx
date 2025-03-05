import type { Metadata } from 'next'
import React from 'react'
import config from '@payload-config'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'
import Footer from '@/components/footer'
import MobileNavigation from '@/components/mobile-nav'
import Navigation from '@/components/navigation'
import { getPayload } from 'payload'
import { importFonts } from '@/styles/fonts'
import { Body } from '@/styles/layout.client'
import { ViewTransitions } from 'next-view-transitions'
import { AdminBar } from '@/components/admin-bar'
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
					<link href="/favicon.ico" rel="icon" sizes="32x32" />
					<link href="/favicon.svg" rel="icon" type="image/svg+xml" />
				</head>
				<Body
					className={`group/route bg-gray-50 dark:data-supports-dark-mode:bg-[#0E0D0D] min-h-screen flex flex-col`}
					style={{ overflow: 'auto' }}
				>
					<MobileNavigation navigation={navItems} />
					<Navigation navigation={navItems} />
					{children}
					<Footer />
					<AdminBar />
				</Body>
			</html>
		</ViewTransitions>
	)
}

export const metadata: Metadata = {
	metadataBase: new URL(getServerSideURL()),
	openGraph: mergeOpenGraph(),
}
