import jwt from 'jsonwebtoken'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { CollectionSlug } from 'payload'
import { NextResponse } from 'next/server'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export async function GET(
	req: Request & {
		cookies: {
			get: (name: string) => {
				value: string
			}
		}
	},
): Promise<Response> {
	const payload = await getPayload({ config: configPromise })
	const token = req.cookies.get('payload-token')?.value
	const { searchParams } = new URL(req.url)
	const path = searchParams.get('path')
	const collection = searchParams.get('collection') as CollectionSlug
	const slug = searchParams.get('slug')

	const previewSecret = searchParams.get('previewSecret')

	if (previewSecret) {
		return new Response('Du bist nicht berechtigt den Entwurf dieser Seite anzusehen', {
			status: 403,
		})
	} else {
		if (!path) {
			return new Response('Kein Pfad angegeben', { status: 404 })
		}

		if (!collection) {
			return new Response('Kein Pfad angegeben', { status: 404 })
		}

		if (!slug) {
			return new Response('Kein Pfad angegeben', { status: 404 })
		}

		if (!token) {
			new Response('Du bist nicht berechtigt den Entwurf dieser Seite anzusehen', { status: 403 })
		}

		if (!path.startsWith('/')) {
			new Response('Dieser Endpunkt kann nur für interne Vorschauen verwendet werden', {
				status: 500,
			})
		}

		let user

		try {
			user = jwt.verify(token, payload.secret)
		} catch (error) {
			payload.logger.error('Error verifying token for live preview:', error)
		}

		const draft = await draftMode()

		// You can add additional checks here to see if the user is allowed to preview this page
		if (!user) {
			draft.disable()
			return new Response('Du bist nicht berechtigt den Entwurf dieser Seite anzusehen', {
				status: 403,
			})
		}

		// Verify the given slug exists
		try {
			const docs = await payload.find({
				collection,
				draft: true,
				limit: 1,
				// pagination: false reduces overhead if you don't need totalDocs
				pagination: false,
				depth: 0,
				select: {},
				where: {
					slug: {
						equals: slug,
					},
				},
			})

			if (!docs.docs.length) {
				return new Response('Seite konnte nicht gefunden werden', { status: 404 })
			}
		} catch (error) {
			payload.logger.error('Error verifying token for live preview:', error)
		}

		draft.enable()

		const url = `${getServerSideURL()}/${path}`
		const res = NextResponse.redirect(url)
		res.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0')
		res.headers.set('Pragma', 'no-cache')
		res.headers.set('Expires', '0')
		return res
	}
}
