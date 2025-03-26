import { Hero } from '@/components/hero'
import Page, { generateMetadata } from './[slug]/page'
import Image from 'next/image'
import Link from 'next/link'
import HeroImage from '../../../public/hero.jpg'
import BibleImage from '../../../public/bible.webp'

export const dynamic = 'force-static'
export const revalidate = 60

export { generateMetadata }

export default function Index() {
	return (
		<>
			<Hero
				heading={'Christentum. Nicht nur schön, sondern auch wahr.'}
				image={{
					src: HeroImage,
					height: 300,
					width: HeroImage.width / (HeroImage.height / 300),
				}}
			/>
			<div className="[&_.prose]:prose-lg">
				<Page params={Promise.resolve({ slug: 'home', index: true })} />
			</div>
			<section style={{ fontSize: 18 }} className="max-w-2xl mx-auto -mb-10 sm:mb-10 px-5 md:px-2">
				<Cards />
			</section>
		</>
	)
}

function Cards() {
	return (
		<div className="relative p-12 bg-black md:mt-10 -mx-5 md:-mx-9 flex flex-col md:flex-row align-top gap-x-8 gap-y-16 items-center">
			<div className="grid stack px-1 py-4 md:w-[95%]">
				<div className="bg-white rounded-xs shadow-sm -rotate-12 opacity-70">
					<div className="rounded-t-xs aspect-video bg-linear-to-r from-yellow-400 via-ping-500 to-orange-400" />
					<div className="p-4">
						<div className="text-2xl font-bold tracking-tight text-gray-900">Artikel 1</div>
					</div>
				</div>
				<div className="bg-white rounded-xs shadow-lg rotate-3 opacity-80">
					<div className="rounded-t-xs aspect-video bg-linear-to-r from-teal-500 from-10% via-sky-500 via-30% to-red-500 to-90%" />
					<div className="p-4">
						<div className="text-2xl font-bold tracking-tight text-gray-900">Artikel 2</div>
					</div>
				</div>
				<div className="bg-white rounded-xs shadow-xl -rotate-3 hover:cursor-default">
					<Image
						src={BibleImage.src}
						className="rounded-t-xs aspect-video"
						alt="bible"
						width={300}
						height={BibleImage.height / (BibleImage.width / 300)}
					/>
					<div className="p-4">
						<div className="font-mono text-2xl font-bold tracking-tight text-gray-900 leading-none">
							Historische Zuverlässigkeit des Lukas-Evangeliums
						</div>
					</div>
				</div>
			</div>
			<div className="text-white md:px-4">
				<h3 className="text-3xl font-medium font-mono">Lese unseren Blog</h3>
				<p className="my-3 text-gray-200">
					Artikel zu Apologetik, Theologie, Philosophie und Wissenschaft.
				</p>
				<Link
					prefetch={true}
					href="/blog"
					className="text-black font-medium inline-flex bg-white px-3 py-2 rounded-px mt-5 text-sm hover:opacity-90 duration-150 transition"
				>
					Zur Übersicht &rarr;
				</Link>
			</div>
		</div>
	)
}
