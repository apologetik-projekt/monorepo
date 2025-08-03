import Link from 'next/link'
import React from 'react'

export default function NotFound() {
	return (
		<div className="container py-28 mx-auto">
			<div className="prose max-w-none">
				<h1 style={{ marginBottom: 0 }}>404</h1>
				<p className="mb-4">Diese Seite konnte nicht gefunden werden.</p>
			</div>
			<Link className="border-b-2 border-neutral-300 hover:border-black" href="/">
				Zurück zur Startseite
			</Link>
		</div>
	)
}
