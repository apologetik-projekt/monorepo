import type { CollectionAfterChangeHook } from 'payload'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { revalidateTag } from 'next/cache'

const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
	payload.logger.info(`Revalidating redirects`)

	revalidateTag('redirects')

	return doc
}

const plugin = redirectsPlugin({
	collections: ['pages', 'posts'],
	overrides: {
		labels: {
			singular: 'Weiterleitung',
			plural: 'Weiterleitungen',
		},
		admin: {
			group: false,
		},
		// @ts-expect-error TODO
		fields: ({ defaultFields }) => {
			return defaultFields.map((field) => {
				if ('name' in field && field.name === 'from') {
					return {
						...field,
						admin: {
							description: 'You will need to rebuild the website when changing this field.',
						},
					}
				}
				return field
			})
		},
		hooks: {
			afterChange: [revalidateRedirects],
		},
	},
})
export default plugin
