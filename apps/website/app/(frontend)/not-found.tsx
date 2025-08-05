import { LivePreviewListener } from '@/components/live-preview'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import React from 'react'

export default async function NotFound() {
	const draft = await draftMode()
	return (
		<div className="max-w-4xl w-full mx-auto my-20 px-4 sm:px-5 md:pl-7 lg:px-0">
			<div className="prose max-w-none">
				<h1 style={{ marginBottom: 0 }}>404</h1>
				<p className="mb-4">Diese Seite konnte nicht gefunden werden.</p>
			</div>
			<Link className="border-b-2 border-neutral-300 hover:border-black" href="/">
				Zurück zur Startseite
			</Link>
			{draft && <LivePreviewListener />}
		</div>
	)
}
