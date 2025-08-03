import type {
	CollectionAfterChangeHook,
	CollectionAfterDeleteHook,
	CollectionBeforeChangeHook,
} from 'payload'
import type { Post } from '../../types'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getTextContent } from '../../utilities/getTextContent'
import { readingTime } from '../../utilities/readingTime'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
	doc,
	previousDoc,
	req: { payload, context },
}) => {
	if (!context.disableRevalidate) {
		if (doc._status === 'published') {
			const path = `/posts/${doc.slug}`

			payload.logger.info(`Revalidating post at path: ${path}`)

			revalidatePath(path)
			revalidateTag('posts-sitemap')
		}

		// If the post was previously published, we need to revalidate the old path
		if (previousDoc._status === 'published' && doc._status !== 'published') {
			const oldPath = `/posts/${previousDoc.slug}`

			payload.logger.info(`Revalidating old post at path: ${oldPath}`)

			revalidatePath(oldPath)
			revalidateTag('posts-sitemap')
		}
	}
	return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
	if (!context.disableRevalidate) {
		const path = `/posts/${doc?.slug}`

		revalidatePath(path)
		revalidateTag('posts-sitemap')
	}

	return doc
}

export const updateReadingTime: CollectionBeforeChangeHook = ({ data }) => {
	try {
		const textContent = getTextContent(data.content?.root?.children)
		const time = readingTime(textContent).minutes
		data.readingTime = time
	} catch (error) {
		console.error(error)
	}
	return data
}
