import { slugField } from '#/payload/fields/slug/config'
import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
	slug: 'tags',
	labels: {
		singular: 'Tag',
		plural: 'Tags',
	},
	admin: {
		group: 'Blog',
		defaultColumns: ['name', 'numberOfPosts'],
		useAsTitle: 'name',
	},
	access: {
		read: () => true,
	},
	fields: [
		{
			name: 'name',
			type: 'text',
		},
		...slugField('name'),
		{
			name: 'posts',
			label: 'Blog-Beiträge',
			type: 'join',
			collection: 'posts',
			on: 'tags',
		},
		{
			name: 'numberOfPosts',
			label: 'Beiträge',
			virtual: true,
			type: 'number',
			admin: {
				hidden: true,
			},
			access: {
				create: () => false,
				update: () => false,
			},
			hooks: {
				afterRead: [
					async ({ siblingData }) => {
						return siblingData.posts?.docs?.length ?? 0
					},
				],
			},
		},
	],
}
