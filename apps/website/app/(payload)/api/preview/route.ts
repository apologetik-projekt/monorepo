import jwt from 'jsonwebtoken'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@repo/payload/config'
import type { CollectionSlug } from 'payload'
import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import * as v from 'valibot'

const searchParamsSchema = v.object({
	path: v.string('Kein Pfad angegeben'),
	collection: v.string('Keine Collection angegeben'),
	slug: v.string('Kein Slug angegeben'),
})

export async function GET(req: NextRequest): Promise<Response> {
	const params = v.safeParse(searchParamsSchema, Object.fromEntries(req.nextUrl.searchParams))
	if (!params.success) return new Response(params.issues.join('\n'), { status: 404 })
	const { path, collection, slug } = params.output

	if (!path.startsWith('/')) {
		return new Response('Dieser Endpunkt kann nur für interne Vorschauen verwendet werden', {
			status: 500,
		})
	}

	const payload = await getPayload({ config: configPromise })
	const draft = await draftMode()

	try {
		const token = req.cookies.get('payload-token')
		if (!token || !token.value) throw Error('No token found!')
		const user = jwt.verify(token.value, payload.secret)
		if (typeof user !== 'object' || !('id' in user)) throw Error('No user found!')
	} catch (error) {
		payload.logger.error('Error verifying token for live preview:', error)
		draft.disable()
		return new Response('Du bist nicht berechtigt die Vorschau dieser Seite zu sehen', {
			status: 403,
		})
	}

	try {
		const docs = await payload.find({
			collection: collection as CollectionSlug,
			draft: true,
			limit: 1,
			pagination: false,
			depth: 0,
			select: {},
			where: {
				slug: {
					equals: slug,
				},
			},
		})

		if (!docs.docs.length) throw Error()
	} catch {
		draft.disable()
		return new Response('Seite konnte nicht gefunden werden', { status: 404 })
	}

	draft.enable()
	redirect(path)
}
