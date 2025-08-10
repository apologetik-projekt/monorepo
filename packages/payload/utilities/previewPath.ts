import type { PayloadRequest, CollectionSlug } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
	posts: '/blog',
	pages: '',
}

type Props = {
	collection: keyof typeof collectionPrefixMap
	slug: string
	req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug }: Props) => {
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

	return `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'}/api/preview?${encodedParams.toString()}`
}
