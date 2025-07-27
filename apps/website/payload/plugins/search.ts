import { searchPlugin } from '@payloadcms/plugin-search'
import type { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'
import type { Field } from 'payload'

export const searchFields: Field[] = [
	{
		name: 'slug',
		type: 'text',
		index: true,
		admin: {
			readOnly: true,
		},
	},
	{
		name: 'meta',
		label: 'Meta',
		type: 'group',
		index: true,
		admin: {
			readOnly: true,
		},
		fields: [
			{
				type: 'text',
				name: 'title',
				label: 'Title',
			},
			{
				type: 'text',
				name: 'description',
				label: 'Description',
			},
			{
				name: 'image',
				label: 'Image',
				type: 'upload',
				relationTo: 'media',
			},
		],
	},
	{
		label: 'Categories',
		name: 'categories',
		type: 'array',
		admin: {
			readOnly: true,
		},
		fields: [
			{
				name: 'relationTo',
				type: 'text',
			},
			{
				name: 'id',
				type: 'text',
			},
			{
				name: 'title',
				type: 'text',
			},
		],
	},
]

export const beforeSyncWithSearch: BeforeSync = async ({ originalDoc, searchDoc }) => {
	const {
		doc: { relationTo: collection },
	} = searchDoc

	const { slug, id, categories, title, meta } = originalDoc

	const modifiedDoc: DocToSync = {
		...searchDoc,
		slug,
		meta: {
			...meta,
			title: meta?.title || title,
			image: meta?.image?.id || meta?.image,
			description: meta?.description,
		},
		categories: [],
	}

	if (categories && Array.isArray(categories) && categories.length > 0) {
		// get full categories and keep a flattened copy of their most important properties
		try {
			const mappedCategories = categories.map((category) => {
				const { id, title } = category

				return {
					relationTo: 'categories',
					id,
					title,
				}
			})

			modifiedDoc.categories = mappedCategories
		} catch (_e: unknown) {
			console.error(
				`Failed. Category not found when syncing collection '${collection}' with id: '${id}' to search.`,
			)
		}
	}

	return modifiedDoc
}

export default searchPlugin({
	collections: ['posts'],
	beforeSync: beforeSyncWithSearch,
	searchOverrides: {
		fields: ({ defaultFields }) => {
			return [...defaultFields, ...searchFields]
		},
	},
})
