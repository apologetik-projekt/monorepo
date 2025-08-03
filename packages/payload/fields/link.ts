import deepMerge from '../utilities/deepMerge'
import type { Field, CollectionSlug } from 'payload'

export type LinkAppearances = 'default' | 'outline'

export const appearanceOptions: Record<LinkAppearances, { label: string; value: string }> = {
	default: {
		label: 'Default',
		value: 'default',
	},
	outline: {
		label: 'Outline',
		value: 'outline',
	},
}

type LinkType = (options?: {
	appearances?: LinkAppearances[] | false
	disableLabel?: boolean
	relationTo?: CollectionSlug[]
	overrides?: Record<string, unknown>
}) => Field

export const link: LinkType = ({
	appearances,
	disableLabel = false,
	relationTo,
	overrides = {},
} = {}) => {
	const linkResult: Field = {
		name: 'link',
		type: 'group',
		admin: {
			hideGutter: true,
		},
		fields: [
			{
				type: 'row',
				fields: [
					{
						name: 'type',
						label: 'Ziel',
						type: 'radio',
						admin: {
							layout: 'horizontal',
							width: '50%',
						},
						defaultValue: 'reference',
						options: [
							{
								label: ({ t }) => t('fields:internalLink'),
								value: 'reference',
							},
							{
								label: ({ t }) => t('fields:customURL'),
								value: 'custom',
							},
						],
					},
					{
						name: 'newTab',
						type: 'checkbox',
						admin: {
							style: {
								alignSelf: 'flex-end',
							},
							width: '50%',
						},
						label: ({ t }) => t('fields:openInNewTab'),
					},
				],
			},
		],
	}

	const linkTypes: Field[] = [
		{
			name: 'reference',
			type: 'relationship',
			admin: {
				condition: (_, siblingData) => siblingData?.type === 'reference',
			},
			label: ({ t }) => t('fields:chooseDocumentToLink'),
			relationTo: relationTo ?? ['media', 'pages'],
			required: true,
		},
		{
			name: 'url',
			type: 'text',
			admin: {
				condition: (_, siblingData) => siblingData?.type === 'custom',
			},
			label: ({ t }) => t('fields:customURL'),
			required: true,
		},
	]

	if (!disableLabel) {
		linkTypes.map((linkType) => ({
			...linkType,
			admin: {
				...linkType.admin,
				width: '50%',
			},
		}))

		linkResult.fields.push({
			type: 'row',
			fields: [
				...linkTypes,
				{
					name: 'label',
					type: 'text',
					admin: {
						width: '50%',
					},
					label: ({ t }) => t('fields:textToDisplay'),
					required: true,
				},
			],
		})
	} else {
		linkResult.fields = [...linkResult.fields, ...linkTypes]
	}

	if (appearances !== false) {
		let appearanceOptionsToUse = [appearanceOptions.default, appearanceOptions.outline]

		if (appearances) {
			appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
		}

		linkResult.fields.push({
			name: 'appearance',
			type: 'select',
			admin: {
				description: 'Wähle aus, wie der Link angezeigt werden soll.',
			},
			defaultValue: 'default',
			options: appearanceOptionsToUse,
		})
	}

	return deepMerge(linkResult, overrides)
}
