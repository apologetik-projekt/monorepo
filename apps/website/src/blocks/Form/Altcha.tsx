'use client'
import { Style } from '@/components/styles'
import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'

const localizedText = {
	ariaLinkLabel: 'Besuche Altcha.org',
	error: 'Verifizierung fehlgeschlagen. Versuche es später nochmal.',
	expired: 'Verifizierung abgelaufen. Versuche es nochmal.',
	footer:
		'<span class="hidden md:inline">Geschützt durch </span><a href="https://altcha.org/de/captcha" target="_blank" aria-label="Besuche Altcha.org">ALTCHA</a>',
	label: 'Ich bin kein Bot 🤖',
	verified: 'Erfolgreich verifiziert',
	verifying: 'Wird überprüft...',
	waitAlert: 'Wird überprüft... bitte warten.',
}

const Fallback = () => <div className="h-[49px] border border-gray-200" />
const AltchaWidget = dynamic(() => import('./AltchaWidget'), { ssr: false, loading: Fallback })

export default function Altcha(props: AltchaWidgetReact) {
	return (
		<div className="min-h-12">
			<Style href="Altcha">
				{{
					'.altcha': {
						display: 'inline-flex',
						textTransform: 'none',
						flexDirection: 'row !important' as 'row',
						justifyContent: 'space-between',
						flexWrap: 'wrap',
					},
					'.altcha-main': {
						order: 1,
						flex: 'auto',
					},
					'.altcha-footer': {
						order: 2,
						flex: 'auto',
					},
					'.altcha-error': {
						order: 3,
						flexBasis: '100%',
						alignItems: 'center',
					},
					'.altcha-checkbox input': {
						color: '#262626',
						'&:checked': {},
					},
				}}
			</Style>

			<AltchaWidget
				challengeurl="/api/altcha"
				verifyurl="/api/altcha"
				//debug={process.env.NODE_ENV === 'development'}
				hidelogo
				auto="onload"
				name="$ACTION_CAPTCHA"
				{...props}
				strings={JSON.stringify(props.strings ?? localizedText)}
				style={{
					fontSize: '14px',
					'--altcha-max-width': '100%',
					'--altcha-border-radius': '0px',
					'--altcha-color-border': '#e8e8e8',
					...props.style,
				}}
				onstatechange={(e: CustomEvent<any>) => {
					if (typeof props.onstatechange == 'function') props.onstatechange(e)
					const widget = e.target as HTMLDivElement
					const checkbox = widget.getElementsByTagName('input')[0]
					if (checkbox) checkbox.inert = e.detail.state == 'verified'
				}}
			/>
		</div>
	)
}
