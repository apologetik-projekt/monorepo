import type { CheckboxField, TextField } from 'payload'
import { formatSlug } from './formatSlug'

type Overrides = {
	slugOverrides?: Partial<TextField>
	checkboxOverrides?: Partial<CheckboxField>
}

type Slug = (fieldToUse?: string, overrides?: Overrides) => [TextField, CheckboxField]

export const slugField: Slug = (fieldToUse = 'title', overrides = {}) => {
	const { slugOverrides, checkboxOverrides } = overrides

	const checkBoxField: CheckboxField = {
		name: 'slugLock',
		type: 'checkbox',
		defaultValue: true,
		admin: {
			hidden: true,
			position: 'sidebar',
		},
		...checkboxOverrides,
	}

	// @ts-expect-error because of typescript mismatching Partial<TextField> with TextField
	const slugField: TextField = {
		name: 'slug',
		type: 'text',
		index: true,
		label: 'Slug',
		unique: true,
		...(slugOverrides || {}),
		hooks: {
			beforeValidate: [
				({ data, operation, value }) => {
					const fallback = fieldToUse
					if (typeof value === 'string') {
						return formatSlug(value)
					}

					if (operation === 'create' || !data?.slug) {
						const fallbackData = data?.[fallback] || data?.[fallback]

						if (fallbackData && typeof fallbackData === 'string') {
							return formatSlug(fallbackData)
						}
					}

					return value
				},
			],
		},
		admin: {
			position: 'sidebar',
			...(slugOverrides?.admin || {}),
			components: {
				Field: {
					path: '@/app/(payload)/admin/components/fields/slug/client#SlugComponent',
					clientProps: {
						fieldToUse,
						checkboxFieldPath: checkBoxField.name,
					},
				},
			},
		},
	}

	return [slugField, checkBoxField]
}
