import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { isAdmin } from '@/access/isAdmin'

export const Navigation: GlobalConfig = {
	slug: 'navigation',
	access: {
		read: () => true,
		update: isAdmin || false,
	},
	admin: {
		group: false,
	},
	hooks: {
		// beforeRead: [
		//   (args) => {
		//     console.log(JSON.stringify(args.doc.navItems, null, 2))
		//     return args
		//   },
		// ],
	},
	fields: [
		{
			name: 'navItems',
			label: 'Navigationseinträge',
			labels: {
				singular: 'Navigationseintrag',
				plural: 'Navigationseinträge',
			},
			type: 'array',
			fields: [
				{
					name: 'type',
					label: 'Typ',
					type: 'radio',
					defaultValue: 'link',
					options: [
						{
							label: 'Link',
							value: 'link',
						},
						{
							label: 'Gruppe',
							value: 'group',
						},
					],
				},
				link({
					appearances: false,
					relationTo: ['pages', 'media'],
					overrides: {
						label: null,
						admin: {
							condition: (_: unknown, siblingData: Partial<any>) => {
								return siblingData?.type === 'link'
							},
							hideGutter: true,
						},
					},
				}),
				{
					name: 'label',
					label: 'Angezeigter Text',
					type: 'text',
					required: true,
					admin: {
						condition: (_: unknown, siblingData: Partial<any>) => {
							return siblingData?.type === 'group'
						},
					},
				},
				{
					name: 'nestedNavItems',
					label: 'Unterseiten',
					labels: {
						plural: 'Unterseiten',
						singular: 'Unterseite',
					},
					localized: true,
					type: 'array',
					fields: [
						link({
							appearances: false,
							overrides: {
								label: null,
							},
							relationTo: ['pages', 'media'],
						}),
					],
					maxRows: 6,
					admin: {
						initCollapsed: true,
						components: {
							RowLabel: '@/app/(payload)/admin/components/RowLabel#RowLabel',
						},
						condition: (_: unknown, siblingData: Partial<any>) => {
							return siblingData?.type === 'group'
						},
					},
				},
			],
			maxRows: 7,
			admin: {
				initCollapsed: true,
				components: {
					RowLabel: '@/app/(payload)/admin/components/RowLabel#RowLabel',
				},
			},
		},
	],
}
