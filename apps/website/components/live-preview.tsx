'use client'
import { getClientSideURL } from '@/utilities/getURL'
//import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export const LivePreviewListener: React.FC = () => {
	const router = useRouter()
	function onMessage(event: MessageEvent) {
		const slug = event.data.data.slug
		if (!slug) return
		const pathname = window.location.pathname
		const newPathname = structuredClone(pathname).replace(/\/[^/]+$/, `/${slug}`)
		if (newPathname != pathname) {
			setTimeout(() => {
				document.location.assign(newPathname)
			}, 500)
		}
	}
	return (
		<PayloadLivePreview
			refresh={router.refresh}
			onMessage={onMessage}
			serverURL={getClientSideURL()}
		/>
	)
}

import { isDocumentEvent, ready, isLivePreviewEvent } from '@payloadcms/live-preview'
import { useCallback, useEffect, useRef } from 'react'

export function PayloadLivePreview(props: {
	apiRoute?: string
	depth?: number
	refresh: () => void
	onMessage?: (event: MessageEvent) => void
	serverURL: string
}) {
	const { apiRoute, depth, refresh, serverURL, onMessage: onMessageCallback } = props
	const hasSentReadyMessage = useRef<boolean>(false)

	const onMessage = useCallback(
		(event: MessageEvent) => {
			if (isLivePreviewEvent(event, serverURL) && typeof onMessageCallback === 'function') {
				onMessageCallback(event)
			}
			if (isDocumentEvent(event, serverURL)) {
				if (typeof refresh === 'function') {
					refresh()
				} else {
					console.error('You must provide a refresh function to `RefreshRouteOnSave`')
				}
			}
		},
		[refresh, serverURL, onMessageCallback]
	)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('message', onMessage)
		}

		if (!hasSentReadyMessage.current) {
			hasSentReadyMessage.current = true

			ready({
				serverURL,
			})

			// refresh after the ready message is sent to get the latest data
			refresh()
		}

		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('message', onMessage)
			}
		}
	}, [serverURL, onMessage, depth, apiRoute, refresh])

	return null
}
