import { lexicalEditor } from '@payloadcms/richtext-lexical'
import type { CollectionConfig } from 'payload'

export const Authors: CollectionConfig<'authors'> = {
  slug: 'authors',
  labels: {
    singular: 'Autor',
    plural: 'Autoren',
  },
  admin: {
    group: 'Blog',
    defaultColumns: ['fullName', 'profilePicture', 'numberOfPosts'],
    useAsTitle: 'fullName',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'profilePicture',
      label: 'Profilbild',
      type: 'upload',
      relationTo: 'media',
      displayPreview: true,
      filterOptions: {
        mimeType: { contains: 'image' },
      },
      admin: {
        isSortable: false,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          label: 'Vorname',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          label: 'Nachname',
          type: 'text',
        },
      ],
    },
    {
      name: 'fullName',
      label: 'Name',
      type: 'text',
      admin: {
        readOnly: true,
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            let fullName = siblingData.firstName
            if (siblingData.lastName) {
              fullName += ` ${siblingData.lastName}`
            }
            return fullName
          },
        ],
      },
    },
    {
      name: 'about',
      label: 'Kurzbeschreibung',
      type: 'richText',
      editor: lexicalEditor({}),
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
    {
      name: 'posts',
      label: 'Blog-Beiträge',
      type: 'join',
      collection: 'posts',
      on: 'author',
    },
  ],
}
