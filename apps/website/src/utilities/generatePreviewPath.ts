import type { PayloadRequest, CollectionSlug } from 'payload'
import { getServerSideURL } from './getURL'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
	posts: '/blog',
	pages: '',
}

type Props = {
	collection: keyof typeof collectionPrefixMap
	slug: string
	req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, req }: Props) => {
	const path = `${collectionPrefixMap[collection]}/${slug}`

	const params = {
		slug,
		collection,
		path,
	}

	const encodedParams = new URLSearchParams()

	Object.entries(params).forEach(([key, value]) => {
		encodedParams.append(key, value)
	})

	return `${getServerSideURL()}/next/preview?${encodedParams.toString()}`
}
