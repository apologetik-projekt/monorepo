import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
const plugin = formBuilderPlugin({
  fields: {
    payment: false,
    state: false,
    country: false,
    message: false,
  },
  formSubmissionOverrides: {
    admin: {
      group: false,
    },
    access: {
      create: () => false,
    },
    labels: {
      singular: 'Formular-Antwort',
      plural: 'Formular-Antworten',
    },
  },
  formOverrides: {
    admin: {
      group: false,
    },
    labels: {
      singular: 'Formular',
      plural: 'Formulare',
    },
    fields: ({ defaultFields }) => {
      return defaultFields.map((field) => {
        if ('name' in field && field.name === 'confirmationMessage') {
          return {
            ...field,
            editor: lexicalEditor({
              features: ({ rootFeatures }) => {
                return [
                  ...rootFeatures.filter((feature) => feature.key == 'toolbarInline'),
                  FixedToolbarFeature(),
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                ]
              },
            }),
          }
        }

        if ('name' in field && field.name === 'fields' && 'blocks' in field) {
          for (const block of field.blocks) {
            if (block.slug == 'checkbox') {
              block.labels = {
                singular: 'Kontrollkästchen',
                plural: 'Kontrollkästchen',
              }
            }
            if (block.slug == 'select') {
              const rI = block.fields.findIndex((v) => 'name' in v && v.name == 'required')
              block.fields[rI] = {
                type: 'row',
                fields: [
                  {
                    name: 'required',
                    type: 'checkbox',
                    label: 'Pflichtfeld',
                  },
                  {
                    name: 'multiple',
                    type: 'checkbox',
                    label: 'Mehrere Auswahlmöglichkeiten möglich',
                    defaultValue: true,
                  },
                ],
              }

              block.labels = {
                singular: 'Auswahlmöglichkeiten',
                plural: 'Auswahlmöglichkeiten',
              }
            }

            if (block.slug == 'textarea') {
              block.labels = {
                singular: 'Mehrzeiliger Text',
                plural: 'Mehrzeiliger Text',
              }
            }

            if (['text', 'email', 'textarea'].includes(block.slug)) {
              block.fields.push({
                name: 'placeholder',
                type: 'text',
                label: 'Platzhalter',
              })
            }
          }
        }
        return field
      })
    },
  },
})
export default plugin
