import { getPayload } from 'payload'
import configPromise from '@repo/payload/config'
import { Link } from 'next-view-transitions'
import Image from 'next/image'
import type { Post } from '@repo/payload'
import { Masonry } from './page.client'

export const metadata = {
	title: 'Apologetik Projekt - Blog',
	description:
		'Christen zurüsten, Zweiflern begegnen, Skeptikern antworten. Artikel zu Apologetik, Theologie, Philosophie und Wissenschaft.',
	openGraph: {
		title: 'Apologetik Projekt - Blog',
		description:
			'Christen zurüsten, Zweiflern begegnen, Skeptikern antworten. Artikel zu Apologetik, Theologie, Philosophie und Wissenschaft.',
		type: 'website',
	},
	other: {
		'Cache-Control': 'public, max-age=60, stale-if-error=60, stale-while-revalidate=86400',
	},
}

const fallBackImage = '/blur-bg.jpg'

export default async function Blog() {
	const payload = await getPayload({ config: configPromise })
	const articles = await payload.find({
		collection: 'posts',
	})
	const latestArticle = articles.docs[0]
	if (!latestArticle) return null

	return (
		<>
			<section className="w-full bg-cover bg-[center_top_33%] text-black dark:text-white -mt-24">
				<div className="pt-12 pb-8 md:pt-24 md:pb-16 bg-linear-to-b from-[#ffe16cef] dark:from-[#594a0ce6] to-gray-50 dark:to-[#0E0D0D] bg-blend-hard-light saturate-75">
					<Link
						prefetch={true}
						href={'/blog/' + latestArticle.slug!}
						className="hidden max-w-5xl mx-auto mt-16 px-4 md:px-2 md:grid grid-cols-2 md:gap-x-4 lg:gap-x-14 hover:opacity-90 duration-200"
					>
						<Image
							style={{ viewTransitionName: `image-${latestArticle.slug}` }}
							alt={latestArticle.title}
							className="object-cover aspect-[27.5/17] w-full"
							src={
								typeof latestArticle.coverImage == 'object' && latestArticle.coverImage?.url
									? latestArticle.coverImage?.url
									: fallBackImage
							}
							loading="eager"
							width={300}
							height={166}
						/>
						<div className="">
							<div className="select-none text-sm mb-1 text-black/80 dark:text-gray-100/80 flex items-center gap-1">
								<svg
									width="9"
									height="14"
									viewBox="0 0 8 12"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M4.5 5H8L3.5 11.5V7H0L4.5 0.5V5Z" fill="currentColor" />
								</svg>
								<span className="uppercase leading-tight font-bold">Neuster Artikel</span>
								<span className="text-sm leading-snug">
									{typeof latestArticle.author == 'object' && latestArticle.author && (
										<span className="leading-relaxed">
											- {latestArticle.author?.firstName} {latestArticle.author.lastName}
										</span>
									)}{' '}
									<span className="opacity-75">•</span>{' '}
									{latestArticle.readingTime ? Math.ceil(latestArticle.readingTime) : '?'}
									&#x200A;min
								</span>
							</div>

							<h2
								style={{
									viewTransitionName: `title-${latestArticle.slug}`,
								}}
								className="font-extrabold md:duration-0 md:animate-none text-[2.75rem] leading-none font-mono mb-4 relative z-30 hover:underline"
							>
								{latestArticle.title}
							</h2>
							<p className="max-w-4xl text-pretty text-opacity-85 font-normal">
								{latestArticle.description}
							</p>
						</div>
					</Link>
				</div>
			</section>
			<main className="max-w-5xl mx-auto px-4 md:px-2 mt-8 pb-10 w-full">
				<Masonry>
					{articles.docs.map((article) => (
						<Article key={article.slug} article={article} />
					))}
				</Masonry>
			</main>
		</>
	)
}

function Article({ article }: { article: Post }) {
	const readingTime = article.readingTime ? Math.ceil(article.readingTime) : null

	return (
		<Link
			prefetch
			href={'/blog/' + article.slug!}
			className="group hover:opacity-90 duration-200 md:first:hidden h-[fit-content]"
		>
			<div>
				<Image
					style={{ viewTransitionName: `image-${article.slug}` }}
					alt={article.title}
					className="object-cover aspect-[27.5/17] w-full"
					src={
						typeof article.coverImage == 'object' && article.coverImage?.url
							? article.coverImage?.url
							: '/blur-bg.jpg'
					}
					loading="lazy"
					width={300}
					height={166}
				/>
				<div className="p-2 h-12 flex items-center -mt-12">
					<div
						className="flex items-center px-2 py-1 rounded-full backdrop-blur-md bg-black/40"
						style={{ viewTransitionName: `author-${article.slug}`, width: 'max-content' }}
					>
						<div className="-translate-x-[3px]">
							<div className="rounded-full overflow-hidden bg-yellow-400 aspect-square size-6">
								{typeof article.author == 'object' &&
									typeof article.author?.profilePicture == 'object' &&
									article.author!.profilePicture?.url && (
										<Image
											style={{ viewTransitionName: `author-image-${article.slug}` }}
											src={article.author!.profilePicture?.url}
											alt="Avatar"
											aria-hidden
											width={22}
											height={22}
										/>
									)}
							</div>
						</div>
						<span className="text-white/90 text-sm font-light leading-snug mx-1.5 mr-1 tabular-nums">
							<span className="leading-relaxed">
								{typeof article.author == 'object' &&
									article.author &&
									`${article.author.firstName} ${article.author.lastName}`}
							</span>
							{readingTime ? <span> • {readingTime}&#x200A;min</span> : null}
						</span>
					</div>
				</div>
			</div>
			<div className="text-black dark:text-white">
				<h3
					className="font-bold md:text-balance hyphens font-mono leading-super-tight tracking-tight text-[2.5rem] mt-4 md:py-1 mb-2.5 group-hover:underline"
					style={{ viewTransitionName: `title-${article.slug}` }}
				>
					{article.title}
				</h3>
				<p className="text-gray-600 dark:text-gray-400 font-normal mb-4">{article.description}</p>
			</div>
		</Link>
	)
}
