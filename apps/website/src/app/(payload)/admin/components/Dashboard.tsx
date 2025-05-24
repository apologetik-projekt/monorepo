import { Button, Gutter } from '@payloadcms/ui'
import Link from 'next/link'
import { type PayloadRequest } from 'payload'
import { Analytics } from './Analytics'
import { cookies, headers } from 'next/headers'
import AnalyticsChart from './AnalyticsChart'; // Added import

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
      {documents.length > 0 && (
        <>
          <header className="list-header">
            <h1>Unveröffentlichte Entwürfe</h1>
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
      <header
        className="list-header"
        style={{ marginBottom: -6, display: 'flex', justifyContent: 'space-between' }}
      >
        <h1>Statistiken</h1>
        <Link href="https://anna.apologetik-projekt.de/apologetik-projekt.de" target="_blank">
          <Button
            buttonStyle="pill"
            icon={
              <svg
                height={15}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ transform: 'translateY(-1px)' }}
              >
                <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V12L17.206 8.207L11.2071 14.2071L9.79289 12.7929L15.792 6.793L12 3H21Z"></path>
              </svg>
            }
          >
            Vollständige Statistiken ansehen
          </Button>
        </Link>
      </header>
      <div style={{ marginTop: '20px', marginBottom: '20px' }}> {/* Added a wrapper div for spacing */}
        <AnalyticsChart /> {/* Added the analytics chart */}
      </div>
      <Analytics theme={theme} />
    </Gutter>
  )
}
