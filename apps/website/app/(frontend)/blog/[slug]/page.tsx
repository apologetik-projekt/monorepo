// import Citation from '~/components/citation'
import { cache } from 'react'
import type { Metadata } from 'next'
import { generateMeta } from '@/utilities/generateMeta'
import { getPayload } from 'payload'
import configPromise from '@repo/payload/config'
import { cookies, draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { AudioPlayer } from '@/components/audio-player'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { LivePreviewListener } from '@/components/live-preview'
import AdminBar from '@/components/admin-bar'

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
	const { isEnabled: draft } = await draftMode()

	const payload = await getPayload({ config: configPromise })

	const result = await payload.find({
		collection: 'posts',
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

export async function generateMetadata({
	params: paramsPromise,
}: {
	params: Promise<any>
}): Promise<Metadata> {
	const { slug = 'home' } = await paramsPromise
	const page = await queryPostBySlug({
		slug,
	})
	if (!page) return {}
	return {
		...generateMeta({ doc: page }),
		other: {
			'Cache-Control': 'public, max-age=60, stale-if-error=60, stale-while-revalidate=86400',
		},
	}
}

const safeDate = new Date()
safeDate.setDate(safeDate.getDate() - 1)

export async function generateStaticParams() {
	const payload = await getPayload({ config: configPromise })
	const pages = await payload.find({
		collection: 'posts',
		draft: false,
		limit: 1000,
		overrideAccess: false,
		pagination: false,
		select: {
			slug: true,
		},
	})

	const params = pages.docs?.map(({ slug }) => ({ slug }))

	return params
}

type Args = {
	params: Promise<{
		slug: string
	}>
}

export default async function Article({ params: paramsPromise }: Args) {
	const { slug } = await paramsPromise
	const article = await queryPostBySlug({ slug })
	const { isEnabled: draft } = await draftMode()
	const hasToken = !!(await cookies()).get('payload-token')

	if (!article) notFound()

	return (
		<article className="max-w-4xl mx-auto p-4 pb-10 w-full">
			{draft && <LivePreviewListener />}
			<header className="max-w-2xl mx-auto">
				<h1
					className="font-extrabold md:text-balance font-mono dark:text-white text-5xl md:text-7xl md:pt-2 relative z-20"
					style={{ viewTransitionName: `title-${slug}` }}
				>
					{article.title}
				</h1>
				<Author author={article.author} date={article.publishedAt} slug={slug} />
			</header>

			{typeof article.coverImage == 'object' && article.coverImage?.url && (
				<div className="my-3 -mx-4 md:m-4 md:mb-6" style={{ viewTransitionName: `image-${slug}` }}>
					<Image
						className="object-cover bg-black origin-center w-full aspect-video"
						src={article.coverImage.url}
						alt="Image"
						width={400}
						height={225}
					/>
				</div>
			)}

			{new Date(article.publishedAt as string) <= safeDate && (
				<div className="-mx-[5px] md:mx-4 md:mb-8">
					<AudioPlayer slug={slug} defaultTime={(article.readingTime ?? 1) * 60 * 1.4} />
				</div>
			)}

			<section
				id="blog"
				className="prose prose-lg dark:prose-invert dark:text-gray-50/75 prose-headings:font-mono prose-ul:pl-4 max-w-2xl mx-auto px-1 -mt-2 selection:bg-sky-300"
			>
				<style
					rel="stylesheet"
					href="https://api.fonts.coollabs.io/css2?family=Noticia+Text&display=swap"
				/>
				<RichText className="break-words" data={article.content!} />
				{article.appendix && article.appendix.root.children.length > 1 && (
					<RichText className="break-words" data={article.appendix!} />
				)}
			</section>
			{hasToken && (
				<AdminBar
					initialMode={draft ? 'draft' : 'live'}
					payloadUrl="http://localhost:3000"
					collection="posts"
					documentId={article.id}
				/>
			)}
		</article>
	)
}

function Author({ author, date, slug }: any) {
	if (!author) return null

	const profileImage =
		author?.image?.url ??
		`https://ui-avatars.com/api/?name=${author?.firstName}+${author?.lastName}&background=7cd3fc&color=22222c`

	return (
		<div
			className="flex items-center py-4 mt-2 -ml-0.5 relative z-10"
			style={{ viewTransitionName: `author-${slug}` }}
		>
			<Image
				style={{ viewTransitionName: `author-image-${slug}` }}
				alt="avatar"
				className="object-cover object-center border-2 border-transparent rounded-full aspect-square h-10"
				height={40}
				width={40}
				src={profileImage}
				placeholder="empty"
				unoptimized={!author?.image?.url}
			/>
			<p className="leading-none mt-1 ml-2">
				<span className="uppercase font-semibold text-gray-700 dark:text-gray-300 opacity-95 relative z-20">
					{author.firstName} {author.lastName}
				</span>{' '}
				<br />
				<span className="text-sm font-medium text-gray-700 dark:text-gray-300 opacity-75 block">
					veröffentlicht am {new Date(date).toLocaleDateString('de-DE')}
				</span>
			</p>
		</div>
	)
}
