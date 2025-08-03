import {
  BoldFeature,
  InlineToolbarFeature,
  ItalicFeature,
  lexicalEditor,
  SubscriptFeature,
  SuperscriptFeature,
} from '@payloadcms/richtext-lexical'
import type { Block } from 'payload'

export const ExcerptBlock: Block = {
  slug: 'excerptBlock',
  interfaceName: 'ExcerptBlock',
  labels: {
    singular: 'Literaturauszug',
    plural: 'Literaturauszüge',
  },
  fields: [
    {
      name: 'text',
      label: false,
      type: 'richText',
      editor: lexicalEditor({
        admin: {
          hideGutter: true,
          placeholder: 'Hier den Text einfügen',
        },
        lexical: {
          namespace: 'block',
          theme: {
            text: {
              base: 'serif',
            },
          },
        },
        features: [
          BoldFeature(),
          SubscriptFeature(),
          SuperscriptFeature(),
          ItalicFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'source',
      type: 'text',
      label: 'Quelle / Textstelle',
    },
  ],
}
