import { defaultEditorFeatures, lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { de } from '@payloadcms/translations/languages/de'
import { en } from '@payloadcms/translations/languages/en'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { Pages } from './collections/Pages/config'
import { Posts } from './collections/Posts/config'
import { Authors } from './collections/Authors'
import { Users } from './collections/Users'
import { Tags } from './collections/Tags'
import { Media } from './collections/Media'
import { Navigation } from './globals/Navigation'
import { postgresAdapter } from '@payloadcms/db-postgres'
import seoPlugin from './plugins/seo'
import formBuilderPlugin from './plugins/formBuilder'
import redirectPlugin from './plugins/redirects'
import azureBlobStoragePlugin from './plugins/azureBlobStorage'
import nodeMailer from './plugins/emailAdapter'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
	admin: {
		avatar: {
			Component: './components/Avatar.tsx#Avatar',
		},
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
		meta: {
			titleSuffix: '| Apologetik Projekt CMS',
			icons: [
				{
					rel: 'icon',
					type: 'image/svg+xml',
					url: '/admin-favicon.svg',
				},
			],
		},
		components: {
			graphics: {
				Logo: '@/components/logo.tsx#Logo',
				Icon: '@/components/logo.tsx#Icon',
			},
			logout: {
				Button: './components/Logout.tsx#LogoutButton',
			},
			beforeNavLinks: [
				{
					path: './components/NavLinks#default',
				},
			],
			views: {
				dashboard: {
					Component: './components/Dashboard#default',
				},
			},
		},
	},
	collections: [Pages, Posts, Authors, Tags, Media, Users],
	globals: [Navigation],
	db: postgresAdapter({
		pool: {
			connectionString: process.env.DATABASE_URI || '',
		},
		migrationDir: path.resolve(dirname, '../migrations'),
	}),
	folders: {
		browseByFolder: false,
		collectionSpecific: true,
	},
	editor: lexicalEditor({ features: defaultEditorFeatures }),
	sharp: sharp,
	plugins: [seoPlugin, formBuilderPlugin, redirectPlugin, azureBlobStoragePlugin],
	typescript: {
		outputFile: path.resolve(dirname, '../types/payload.d.ts'),
	},
	i18n: {
		fallbackLanguage: 'de',
		supportedLanguages: { de, en },
		translations: {
			de: {
				general: {
					createNew: 'Neuen Eintrag erstellen',
					createNewLabel: 'Neuen Eintrag erstellen',
				},
			},
		},
	},
	email: nodeMailer,
	secret: process.env.PAYLOAD_SECRET || '',
	telemetry: false,
})
