import type { CollectionBeforeOperationHook, CollectionConfig } from 'payload'

import { ImageBlock } from '../../blocks/Media/config'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import {
  lexicalEditor,
  BlocksFeature,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  UploadFeature,
  HTMLConverterFeature,
} from '@payloadcms/richtext-lexical'

import { slugField } from '@/fields/slug/config'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { ExcerptBlock } from '@/blocks/Excerpt/config'
import { revalidateDelete, revalidatePost, updateReadingTime } from './hooks'

const populateInitialData: CollectionBeforeOperationHook = ({ args, operation, req }) => {
  if (operation === 'create' || operation === 'update') {
    if (!req.data || !req.data.publishedAt) {
      args.data.publishedAt = new Date()
    }
  }
  return args
}

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  labels: {
    singular: 'Post',
    plural: 'Posts',
  },
  defaultPopulate: {
    title: true,
    slug: true,
    coverImage: true,
  },
  admin: {
    group: 'Blog',
    defaultColumns: ['title', 'slug', 'updatedAt', 'publishedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'posts',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'posts',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      label: 'Titel',
      type: 'text',
      required: true,
    },
    ...slugField(),
    {
      name: 'coverImage',
      label: 'Titelbild',
      type: 'upload',
      relationTo: 'media',
      maxDepth: 1,
      required: true,
      displayPreview: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      label: 'Zusammenfassung',
      type: 'textarea',
      maxLength: 180,
      required: true,
      admin: {
        rows: 3,
      },
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
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    BlocksFeature({ blocks: [ImageBlock, ExcerptBlock] }),
                    HTMLConverterFeature(),
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
            {
              name: 'relatedPosts',
              label: 'Ähnliche Beiträge',
              type: 'relationship',
              relationTo: 'posts',
              filterOptions: (data) => ({
                id: {
                  not_equals: data.id,
                },
              }),
              hasMany: true,
              maxRows: 4,
              admin: {
                allowCreate: false,
              },
            },
          ],
          label: 'Inhalt',
        },
        {
          name: 'meta',
          label: 'SEO',
          description:
            'Hier kannst du optimieren, welche Inhalte auf Google oder sozialen Netzwerken angezeigt werden sollen. Nicht notwendig, wenn Inhalte sich nicht von Titel, Titelbild und Zusammenfassung unterscheiden sollen.',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaDescriptionField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
              hasGenerateFn: true,
            }),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'author',
      label: 'Autor',
      type: 'relationship',
      relationTo: 'authors',
      hasMany: false,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Veröffentlicht am',
      admin: {
        description: 'Dient nur zur Anzeige und hat keinen Einfluss auf die Veröffentlichung.',
        position: 'sidebar',
      },
    },
    {
      name: 'readingTime',
      type: 'number',
      defaultValue: 0,
      admin: {
        hidden: true,
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [updateReadingTime],
    beforeOperation: [populateInitialData],
    afterChange: [revalidatePost],
    afterDelete: [revalidateDelete],
  },
  timestamps: true,
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
