import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export default formBuilderPlugin({
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
						label: 'Bestätigungs-Nachricht',
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

				if ('name' in field) {
					if (field.name == 'title') {
						field.label = 'Titel'
					}
					if (field.name == 'submitButtonLabel') {
						field.label = 'Text für Bestätigungs-Button'
					}
					if (field.name == 'confirmationType') {
						field.label = 'Bestätigungs-Methode'
						field.admin = {
							...field.admin,
							description:
								'Wähle, ob du eine auf der Seite angezeigte Nachricht oder eine Weiterleitung zu einer anderen Seite nach dem Absenden des Formulars anzeigen möchtest.',
						}
						// @ts-expect-error Options are not correctly typed
						for (const option of field.options) {
							if (option.value == 'redirect') {
								option.label = 'Weiterleitung'
							}
							if (option.value == 'message') {
								option.label = 'Nachricht'
							}
						}
					}
					if (field.name == 'redirect') {
						field.label = 'Weiterleitung'
						// @ts-expect-error TODO
						for (const f of field.fields) {
							if ('name' in f && f.name == 'url') {
								f.label = 'URL'
							}
						}
					}
					if (field.name == 'emails') {
						field.label = 'E-Mails'
						field.admin = {
							...field.admin,
							description:
								'Versende benutzerdefinierte E-Mails, wenn das Formular gesendet wird. Verwende kommaseparierte Listen, um die gleiche E-Mail an mehrere Empfänger zu senden. Um einen Wert aus diesem Formular zu referenzieren, umgebe den Namen des Feldes mit doppelten geschweiften Klammern, z.B. {{firstName}}. Du kannst ein Wildcard-Zeichen {{*}} verwenden, um alle Daten auszugeben, oder {{*:table}}, um sie als HTML-Tabelle in der E-Mail zu formatieren.',
						}
						// @ts-expect-error TODO
						for (const f of field.fields) {
							if ('name' in f && f.name == 'subject') {
								f.label = 'Betreff'
								f.defaultValue = 'Neue Nachricht von apologetik-projekt.de'
							}
							if ('name' in f && f.name == 'message') {
								f.label = 'Nachricht'
								f.admin.description =
									'Gib hier die Nachricht ein, die versendet wird, wenn die E-Mail versendet wird.'
							}
							console.log(f)
							if ('type' in f && f.type == 'row' && 'fields' in f) {
								for (const subField of f.fields) {
									if ('name' in subField && subField.name == 'emailTo') {
										subField.label = 'Empfänger'
									}
									if ('name' in subField && subField.name == 'replyTo') {
										subField.label = 'Antwort geht an'
										subField.admin.placeholder = 'z.B. info@apologetik-projekt.de oder {{email}}'
									}
									if ('name' in subField && subField.name == 'emailFrom') {
										subField.label = 'Absender'
										subField.defaultValue =
											'"Apologetik Projekt" <DoNotReply@apologetik-projekt.de>'
									}
								}
							}
						}
					}
				}

				if ('name' in field && field.name === 'fields' && 'blocks' in field) {
					field.label = 'Formular-Felder'
					field.labels = {
						singular: 'Feld',
						plural: 'Felder',
					}
					for (const block of field.blocks) {
						for (const field of block.fields) {
							if ('label' in field && field.label == 'Required') {
								field.label = 'Pflichtfeld'
							}
							if ('label' in field && field.label == 'Field Width (percentage)') {
								field.label = 'Breite des Feldes (Prozent)'
							}
							if ('type' in field && field.type == 'row' && 'fields' in field) {
								for (const subField of field.fields) {
									if ('label' in subField && subField.label == 'Field Width (percentage)') {
										subField.label = 'Breite des Feldes (Prozent)'
									}
									if (
										'label' in subField &&
										subField.label == 'Name (lowercase, no special characters)'
									) {
										subField.label = 'Variablen-Name (klein, keine Sonderzeichen)'
									}
									if ('label' in subField && subField.label == 'Label') {
										subField.label = 'Beschriftung'
									}
									if ('label' in subField && subField.label == 'Default Value') {
										subField.label = 'Standardwert'
									}
									if ('label' in subField && subField.label == 'Required') {
										subField.label = 'Pflichtfeld'
									}
								}
							}
						}
						if (block.slug == 'checkbox') {
							block.labels = {
								singular: 'Kontrollkästchen',
								plural: 'Kontrollkästchen',
							}
						}
						if (block.slug == 'number') {
							block.labels = {
								singular: 'Zahl',
								plural: 'Zahlen',
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
