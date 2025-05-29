export const dynamic = 'force-dynamic'

export function GET() {
	return new Response('healthy', { status: 200 })
}
