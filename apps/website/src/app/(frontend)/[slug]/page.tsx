import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/redirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/live-preview'
import { RenderBlocks } from '@/blocks/RenderBlocks'

export async function generateStaticParams() {
	const payload = await getPayload({ config: configPromise })
	const pages = await payload.find({
		collection: 'pages',
		draft: false,
		limit: 1000,
		overrideAccess: false,
		pagination: false,
		select: {
			slug: true,
		},
	})

	const params = pages.docs
		?.filter((doc) => doc.slug !== 'home' && doc.slug !== null)
		.map(({ slug }) => ({ slug }))

	return params
}

type Args = {
	params: Promise<{
		slug?: string
	}>
}

export default async function Page({ params: paramsPromise }: Args) {
	const { isEnabled: draft } = await draftMode()
	const { slug = 'home' } = await paramsPromise
	const url = '/' + slug

	let page = await queryPageBySlug({ slug })

	if (!page) return <PayloadRedirects url={url} />

	return (
		<main className="max-w-4xl w-full mx-auto px-5 pt-5 pb-10 break-words">
			<div className="absolute inset-0 h-68 -z-1 w-full bg-linear-to-b from-[#ffe16c80] to-gray-50 bg-blend-hard-light"></div>
			{/* Allows redirects for valid pages */}
			<PayloadRedirects disableNotFound url={url} />
			{draft && <LivePreviewListener />}
			{page.showTitle && page.title && (
				<h1 className="font-extrabold max-w-2xl mx-auto font-mono text-6xl mt-4 mb-14">
					{page.title}
				</h1>
			)}
			<div className="prose max-w-2xl my-2 mx-auto md:prose-base">
				<RenderBlocks content={page.content} />
			</div>
		</main>
	)
}

export async function generateMetadata({
	params: paramsPromise,
}: {
	params: Promise<any>
}): Promise<Metadata> {
	const { slug = 'home' } = await paramsPromise
	const page = await queryPageBySlug({ slug })
	if (!page) return {}
	return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
	const { isEnabled: draft } = await draftMode()

	const payload = await getPayload({ config: configPromise })

	const result = await payload.find({
		collection: 'pages',
		draft,
		limit: 1,
		pagination: false,
		overrideAccess: draft,
		where: {
			slug: {
				equals: slug,
			},
		},
	})

	return result.docs?.[0] || null
})
