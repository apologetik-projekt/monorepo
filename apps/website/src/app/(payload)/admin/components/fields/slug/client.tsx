'use client'
import React, { useCallback, useEffect } from 'react'
import type { TextFieldClientProps } from 'payload'

import { useField, Button, TextInput, FieldLabel, useFormFields, useForm } from '@payloadcms/ui'

import { formatSlug } from '@/fields/slug/formatSlug'
import './index.css'

type SlugComponentProps = {
	fieldToUse: string
	checkboxFieldPath: string
} & TextFieldClientProps

export const SlugComponent: React.FC<SlugComponentProps> = ({
	field,
	fieldToUse,
	checkboxFieldPath: checkboxFieldPathFromProps,
	path,
	readOnly: readOnlyFromProps,
}) => {
	const { label } = field

	const checkboxFieldPath = path?.includes('.')
		? `${path}.${checkboxFieldPathFromProps}`
		: checkboxFieldPathFromProps

	const { value, setValue } = useField<string>({ path: path || field.name })

	const { dispatchFields } = useForm()

	// The value of the checkbox
	// We're using separate useFormFields to minimise re-renders
	const checkboxValue = useFormFields(([fields]) => {
		return fields[checkboxFieldPath]?.value as string
	})

	// The value of the field we're listening to for the slug
	const targetFieldValue = useFormFields(([fields]) => {
		return fields[fieldToUse]?.value as string
	})

	useEffect(() => {
		if (checkboxValue) {
			if (targetFieldValue) {
				const formattedSlug = formatSlug(targetFieldValue)

				if (value !== formattedSlug) setValue(formattedSlug)
			} else {
				if (value !== '') setValue('')
			}
		}
	}, [targetFieldValue, checkboxValue, setValue, value])

	const handleLock = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault()

			dispatchFields({
				type: 'UPDATE',
				path: checkboxFieldPath,
				value: !checkboxValue,
			})
		},
		[checkboxValue, checkboxFieldPath, dispatchFields],
	)

	const readOnly = readOnlyFromProps || checkboxValue

	if (value == 'home') return null

	return (
		<div className="field-type slug-field-component">
			<FieldLabel htmlFor={`field-${path}`} label={label} />

			<TextInput
				value={value}
				onChange={setValue}
				path={path || field.name}
				readOnly={Boolean(readOnly)}
				AfterInput={
					<Button
						className="lock-button"
						buttonStyle="none"
						onClick={handleLock}
						tooltip={checkboxValue ? 'Entsperren' : 'Sperren'}
						aria-label={checkboxValue ? 'Entsperren' : 'Sperren'}
					>
						<LockIcon open={!checkboxValue} />
					</Button>
				}
			/>
		</div>
	)
}

function LockIcon({ open = false }: { open?: boolean }) {
	const closedPath =
		'M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM5 12V20H19V12H5ZM11 14H13V18H11V14ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17Z'
	const openPath =
		'M7 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C14.7405 2 17.1131 3.5748 18.2624 5.86882L16.4731 6.76344C15.6522 5.12486 13.9575 4 12 4C9.23858 4 7 6.23858 7 9V10ZM5 12V20H19V12H5ZM10 15H14V17H10V15Z'
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			height="14"
			width="14"
			viewBox="0 2 24 26"
			fill="currentColor"
		>
			<path d={open ? openPath : closedPath}></path>
		</svg>
	)
}
