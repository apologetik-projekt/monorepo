import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'imageBlock',
  interfaceName: 'ImageBlock',
  labels: {
    singular: 'Bild',
    plural: 'Bilder',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: {
        mimeType: { contains: 'image' },
      },
    },
    {
      name: 'size',
      type: 'radio',
      label: 'Größe',
      admin: {
        layout: 'horizontal',
      },
      defaultValue: '100%',
      options: [
        {
          label: '100%',
          value: '100%',
        },
        {
          label: '75%',
          value: '75%',
        },
        {
          label: '50%',
          value: '50%',
        },
        {
          label: '25%',
          value: '25%',
        },
      ],
    },
    {
      name: 'alignment',
      type: 'radio',
      label: 'Positionierung',
      defaultValue: 'left',
      admin: {
        layout: 'horizontal',
        condition: (_, siblingData) => siblingData.size !== '100%',
      },
      options: [
        {
          label: 'Links',
          value: 'left',
        },
        {
          label: 'Zentriert',
          value: 'center',
        },
        {
          label: 'Rechts',
          value: 'right',
        },
      ],
    },
    {
      name: 'float',
      type: 'radio',
      label: 'Zeilenumbruch',
      defaultValue: 'false',
      admin: {
        layout: 'horizontal',
        condition: (_, siblingData) =>
          siblingData.alignment !== 'center' && siblingData.size !== '100%',
      },
      options: [
        {
          label: 'Text unterhalb des Bildes weiterführen',
          value: 'false',
        },
        {
          label: 'Text umfließt Bild',
          value: 'true',
        },
      ],
    },
  ],
}
