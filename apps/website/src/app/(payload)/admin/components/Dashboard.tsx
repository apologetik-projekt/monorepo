import { Button, Gutter } from '@payloadcms/ui'
import Link from 'next/link'
import { type PayloadRequest } from 'payload'
import { cookies, headers } from 'next/headers'
import AnalyticsChart from './AnalyticsChart' // Added import
import { QueryClientProvider } from './QueryClientProvider'

const columns = [
	{
		heading: 'Titel',
		accessor: 'title',
	},
	{
		heading: 'Typ',
		accessor: 'type',
	},
	{
		heading: 'Aktualisiert am',
		accessor: 'updatedAt',
	},
] as const

export default async function Dashboard(req: PayloadRequest) {
	const [pages, posts] = await Promise.all([
		req.payload.findVersions({
			collection: 'pages',
			where: {
				'version._status': {
					equals: 'draft',
				},
				latest: {
					equals: true,
				},
			},
		}),
		req.payload.findVersions({
			collection: 'posts',
			where: {
				'version._status': {
					equals: 'draft',
				},
				latest: {
					equals: true,
				},
			},
		}),
	])

	const documents = [
		...pages.docs.map((d) => ({ ...d, type: 'page' })),
		...posts.docs.map((d) => ({ ...d, type: 'post' })),
	]

	const cookie = await cookies()
	const header = await headers()
	const theme =
		cookie.get('payload-theme')?.value ?? header.get('Sec-CH-Prefers-Color-Scheme') ?? 'light'
	return (
		<Gutter className="collection-list">
			<header className="list-header" style={{ marginBottom: 24 }}>
				<h1>Dashboard</h1>
			</header>
			{documents.length > 0 && (
				<>
					<header className="list-header">
						<h3>Unveröffentlichte Entwürfe</h3>
					</header>
					<div className="table table--appearance-default" style={{ marginTop: 16 }}>
						<table cellPadding="0" cellSpacing="0">
							<thead>
								<tr>
									{columns.map((col) => (
										<th key={col.accessor} id={`heading-${col.accessor}`}>
											{col.heading}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{documents.map(({ version, type, parent }, rowIndex) => (
									<tr className={`row-${rowIndex + 1}`} key={rowIndex}>
										{columns.map((col, index) => {
											if (col.accessor == 'title') {
												return (
													<td key={index}>
														<Link href={`admin/collections/${type}s/${parent}`}>
															{version.title}
														</Link>
													</td>
												)
											}
											if (col.accessor == 'type') {
												return <td key={index}>{type == 'page' ? 'Seite' : 'Blog-Post'}</td>
											}
											if (col.accessor == 'updatedAt') {
												const date = new Date(version.updatedAt).toLocaleString('de-DE')
												return <td key={index}>{date}</td>
											}
										})}
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<br />
				</>
			)}
			<QueryClientProvider>
				<AnalyticsChart />
			</QueryClientProvider>
		</Gutter>
	)
}
