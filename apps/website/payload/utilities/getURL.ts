const canUseDOM = !!(
	typeof window !== 'undefined' &&
	window.document &&
	window.document.createElement
)

export function getServerSideURL() {
	return process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
}

export const getClientSideURL = () => {
	if (canUseDOM) {
		const protocol = window.location.protocol
		const domain = window.location.hostname
		const port = window.location.port

		return `${protocol}//${domain}${port ? `:${port}` : ''}`
	}

	return process.env.NEXT_PUBLIC_SERVER_URL || ''
}
