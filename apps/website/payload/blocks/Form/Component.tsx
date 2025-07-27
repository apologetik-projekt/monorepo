import type { Form as FormType } from '#/types/payload'
import type { SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { getPayload } from 'payload'
import { SubmitButton, Form } from './Component.client'
import configPromise from '#/payload/payload.config'
import Altcha from './Altcha'

export function FormBlock({ node }: { node: SerializedBlockNode }) {
	const form = node.fields.form
	async function action(formData: FormData) {
		'use server'
		const payload = await getPayload({ config: configPromise })
		const submissionData = Object.entries(Object.fromEntries(formData.entries()))
			.filter(([name]) => !name.startsWith('$ACTION'))
			.map(([name, value]) => ({
				field: name,
				value: String(value),
			}))
		return payload.create({
			collection: 'form-submissions',
			data: {
				form: form.id,
				submissionData,
			},
		})
	}
	return (
		<div className="flex max-w-2xl flex-col mx-auto space-y-5 hyphens-auto mt-6">
			<Form action={action} className="space-y-6 text-gray-800 [&_label]:tracking-wide no-tap">
				{form.fields.map((input: NonNullable<FormType['fields']>[number], index: number) => {
					if (input.blockType == 'checkbox') {
						return (
							<div key={index} className="flex items-center">
								<input
									className="text-yellow-500 focus:border-yellow-400 ring-yellow-500 border-neutral-400 checked:border-yellow-500 not:checked:bg-neutral-50 size-5 mr-2"
									required={input.required ?? false}
									type="checkbox"
									name={input.name}
								/>
								<label
									className="text-sm leading-none tracking-normal font-semibold"
									htmlFor={input.name}
								>
									{input.label} <OptionalLabel required={input.required} />
								</label>
							</div>
						)
					}
					if (input.blockType == 'select') {
						if (input.multiple) {
							return (
								<div key={index}>
									<label className="text-xs leading-none uppercase font-bold" htmlFor={input.name}>
										{input.label} <OptionalLabel required={input.required} />
									</label>
									<select
										className="block mt-1 mb-2 w-full input-field"
										required={input.required ?? false}
										name={input.name}
										defaultValue={input.defaultValue ?? ''}
										multiple
									>
										{!input.defaultValue && (
											<option className="opacity-50" value="" disabled>
												Bitte wähle mindestens eine Option aus
											</option>
										)}
										{input.options!.map((option: any) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
								</div>
							)
						}
						return (
							<div key={index}>
								<label className="text-xs leading-none uppercase font-bold">
									{input.label} <OptionalLabel required={input.required} />
								</label>
								<div className="flex flex-col gap-1.5 mt-1.5">
									{input.options!.map((option: any) => (
										<div className="flex items-center" key={option.value}>
											<input
												defaultChecked={input.defaultValue == option.value}
												id={'radio-' + option.value}
												type="radio"
												value={option.value}
												name={input.name}
												className="size-5 text-yellow-600  checked:bg-yellow-500 checked:border-yellow-500/70 border-neutral-400 focus:ring-yellow-500 focus:ring-2"
											/>
											<label
												htmlFor={'radio-' + option.value}
												className="ms-2 text-base font-normal text-neutral-900"
											>
												{option.label}
											</label>
										</div>
									))}
								</div>
							</div>
						)
					}
					if (input.blockType == 'textarea') {
						return (
							<div key={index}>
								<label className="text-xs leading-none uppercase font-bold" htmlFor={input.name}>
									{input.label} <OptionalLabel required={input.required} />
								</label>
								<textarea
									spellCheck={false}
									required={input.required ?? false}
									placeholder={input.placeholder ?? undefined}
									rows={8}
									className="block my-1 w-full input-field"
									name={input.name}
								></textarea>
							</div>
						)
					}
					return (
						<div key={index}>
							<label className="text-xs leading-none uppercase font-bold" htmlFor={input.name}>
								{input.label} <OptionalLabel required={input.required} />
							</label>
							<input
								className="block mt-1 mb-2 w-full input-field"
								required={input.required ?? false}
								// @ts-expect-error for custom field
								placeholder={input.placeholder ?? undefined}
								name={input.name}
								type={input.blockType}
							/>
						</div>
					)
				})}
				<Altcha />
				<div className="flex items-center uppercase mt-4 text-base">
					<SubmitButton>{form.submitButtonLabel}</SubmitButton>
				</div>
			</Form>
		</div>
	)
}

const OptionalLabel = ({ required }: { required?: boolean | null }) => {
	if (required) return null
	return <span className="opacity-45 tracking-normal font-medium normal-case">(optional)</span>
}
