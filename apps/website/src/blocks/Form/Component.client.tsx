'use client'
import type { FormSubmission } from '#/types/payload'
import { useFormStatus } from 'react-dom'
import { useActionState, type DetailedHTMLProps, type FormHTMLAttributes } from 'react'
import { defaultJSXConverters, RichText } from '@payloadcms/richtext-lexical/react'

export function SubmitButton({ children }: React.PropsWithChildren) {
	const form = useFormStatus()
	return (
		<>
			<button
				type="submit"
				disabled={form.pending}
				className="py-2.25 px-4 font-semibold text-gray-100 bg-gray-800 shadow-2xs hover:cursor-pointer hover:shadow-xs hover:bg-black focus:bg-yellow-900 focus:rounded-none focus:outline-yellow-500 focus:ring-yellow-500 focus:outline-0 focus:border-yellow-500 active:bg-gray-900"
			>
				{children}
			</button>
			{form.pending && <LoadingSpinner />}
		</>
	)
}

function LoadingSpinner() {
	return (
		<svg
			className="animate-spin ml-3 h-5 w-5 text-gray-800"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle
				className="opacity-25"
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth="4"
			></circle>
			<path
				className="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	)
}

interface FormProps
	extends Omit<DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'action'> {
	action: (formData: FormData) => Promise<FormSubmission>
}

export function Form({ action, children, ...props }: FormProps) {
	async function a(_: any, formData: FormData) {
		try {
			if (typeof action == 'function') {
				const result = await action(formData)
				return result
			}
		} catch (_e: any) {
			return 'error'
		}
		return 'idle'
	}
	const [state, formAction] = useActionState(a, 'idle')
	if (state == 'idle')
		return (
			<form {...props} action={formAction}>
				{children}
			</form>
		)
	if (state == 'error') {
		return (
			<form {...props} action={formAction}>
				<div className="text-red-500">Unerwarteter Error! Bitte versuche es erneut.</div>
				{children}
			</form>
		)
	}
	const form = state.form as any
	if ('confirmationType' in form && form.confirmationType == 'message') {
		return <RichText data={form.confirmationMessage} converters={defaultJSXConverters} />
	}
	return null
}
