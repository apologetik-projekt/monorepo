import { defaultEditorFeatures, lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig, type CollectionConfig } from 'payload'
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
import { nodeMailer, consoleMailer } from './plugins/emailAdapter'
import { getConnectionString } from './utilities/database'
import { randomBytes } from 'crypto'

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
			importMapFile: path.resolve(dirname, './importMap.js'),
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
				Logo: './components/Logo.tsx#Logo',
				Icon: './components/Logo.tsx#Icon',
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
			connectionString: getConnectionString(),
		},
		migrationDir: path.resolve(dirname, './migrations'),
	}),
	folders: {
		browseByFolder: false,
		collectionSpecific: true,
		collectionOverrides: [
			({ collection }: { collection: CollectionConfig }) => {
				collection.labels!.singular = 'Ordner'
				collection.labels!.plural = 'Ordner'
				return collection
			},
		],
	},
	editor: lexicalEditor({ features: defaultEditorFeatures }),
	sharp: sharp,
	plugins: [seoPlugin, formBuilderPlugin, redirectPlugin, azureBlobStoragePlugin],
	typescript: {
		outputFile: path.resolve(dirname, './types.d.ts'),
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
				version: {
					schedulePublish: 'Veröffentlichung planen',
				},
			},
		},
	},
	email: process.env.SMTP_HOST ? nodeMailer : consoleMailer(),
	secret: process.env.PAYLOAD_SECRET || randomBytes(32).toString('base64'),
	telemetry: false,
})
