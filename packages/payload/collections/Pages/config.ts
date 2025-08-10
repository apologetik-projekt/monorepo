import { type CollectionBeforeOperationHook, type CollectionConfig } from 'payload'

import { ImageBlock } from '../../blocks/Media'

import {
	MetaDescriptionField,
	MetaImageField,
	MetaTitleField,
	OverviewField,
	PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { authenticated } from '../../access/authenticated'
import {
	lexicalEditor,
	BlocksFeature,
	EXPERIMENTAL_TableFeature,
	FixedToolbarFeature,
	UploadFeature,
} from '@payloadcms/richtext-lexical'

import { slugField } from '../../fields/slug/config'
import { generatePreviewPath } from '../../utilities/previewPath'
import { customAlphabet, urlAlphabet } from 'nanoid'
import { isAdmin } from '../../access/isAdmin'
import { FormBlock } from '../../blocks/Form'
import { disableDelete, revalidateDelete, revalidatePage } from './hooks'

const nanoid = customAlphabet(urlAlphabet.replace(/[_-]/g, ''), 16)

const populateInitialData: CollectionBeforeOperationHook = ({ args, operation, req }) => {
	if (operation === 'create') {
		args.data.id = nanoid()
	}
	if (operation === 'create' || operation === 'update') {
		if (!req.data || !req.data.publishedAt) {
			args.data.publishedAt = new Date()
		}
	}
	return args
}

export const Pages: CollectionConfig<'pages'> = {
	slug: 'pages',
	access: {
		create: authenticated,
		delete: authenticated,
		read: () => true,
		update: authenticated,
		admin: ({ req }) => isAdmin({ req }) || req.user?.role === 'editor',
	},
	labels: {
		singular: 'Seite',
		plural: 'Seiten',
	},
	defaultPopulate: {
		id: true,
		title: true,
		slug: true,
	},
	admin: {
		group: false,
		defaultColumns: ['title', 'slug', 'updatedAt', '_status'],
		livePreview: {
			url: ({ data, req }) => {
				const path = generatePreviewPath({
					slug: typeof data?.slug === 'string' ? data.slug : '',
					collection: 'pages',
					req,
				})

				return path
			},
		},
		preview: (data, { req }) =>
			generatePreviewPath({
				slug: typeof data?.slug === 'string' ? data.slug : '',
				collection: 'pages',
				req,
			}),
		useAsTitle: 'title',
	},
	fields: [
		{
			name: 'id',
			type: 'text',
			admin: {
				hidden: true,
			},
			required: true,
		},
		{
			name: 'title',
			label: 'Titel',
			type: 'text',
			required: true,
		},
		{
			name: 'showTitle',
			type: 'checkbox',
			label: 'Seitentitel anzeigen',
			defaultValue: true,
		},
		{
			type: 'tabs',
			tabs: [
				{
					fields: [
						{
							name: 'content',
							label: false,
							type: 'richText',
							editor: lexicalEditor({
								admin: {
									hideGutter: true,
								},
								features: ({ rootFeatures }) => {
									return [
										...rootFeatures.filter((f) => f.key !== 'toolbarInline'),
										FixedToolbarFeature(),
										BlocksFeature({ blocks: [ImageBlock, FormBlock] }),
										//LayoutFeature(),
										EXPERIMENTAL_TableFeature(),
										UploadFeature({
											collections: {
												media: {
													fields: [
														{
															type: 'text',
															label: 'Test',
														},
													],
												},
											},
										}),
									]
								},
							}),
						},
					],
					label: 'Inhalt',
				},
				{
					name: 'meta',
					label: 'SEO',
					description: 'Optimiere die Seite für Suchmaschinen bzw. soziale Netzwerke',
					fields: [
						OverviewField({
							titlePath: 'meta.title',
							descriptionPath: 'meta.description',
							imagePath: 'meta.image',
						}),
						MetaTitleField({
							hasGenerateFn: true,
						}),
						MetaImageField({
							relationTo: 'media',
							hasGenerateFn: true,
						}),

						MetaDescriptionField({}),
						PreviewField({
							hasGenerateFn: true,
							titlePath: 'meta.title',
							descriptionPath: 'meta.description',
						}),
					],
				},
			],
		},
		{
			name: 'publishedAt',
			type: 'date',
			admin: {
				position: 'sidebar',
			},
		},
		...slugField(),
	],
	hooks: {
		beforeOperation: [populateInitialData],
		afterChange: [revalidatePage],
		beforeDelete: [disableDelete],
		afterDelete: [revalidateDelete],
	},
	versions: {
		drafts: {
			autosave: {
				interval: 150,
			},
			schedulePublish: true,
		},
		maxPerDoc: 50,
	},
}
