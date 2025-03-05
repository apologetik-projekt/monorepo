import type { Metadata } from 'next'
// import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
	type: 'website',
	description:
		'Christentum - nicht nur schön, sondern auch wahr. Christen zurüsten. Zweiflern begegnen. Skeptikern antworten.',
	// images: [
	//   {
	//     url: `${getServerSideURL()}/website-template-OG.webp`,
	//   },
	// ],
	siteName: 'Das Apologetik Projekt',
	title: 'Das Apologetik Projekt - Christliche Apologetik',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
	return {
		...defaultOpenGraph,
		...og,
		images: og?.images ? og.images : defaultOpenGraph.images,
	}
}
