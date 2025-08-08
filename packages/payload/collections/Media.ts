import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { CollectionConfig } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
	slug: 'media',
	labels: {
		singular: 'Datei',
		plural: 'Dateien',
	},
	admin: {
		group: false,
		groupBy: true,
	},
	access: {
		read: () => true,
	},
	fields: [
		{
			name: 'alt',
			type: 'text',
		},
	],
	folders: true,
	upload: {
		// Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
		staticDir: path.resolve(dirname, '../media'),
		adminThumbnail: 'thumbnail',
		focalPoint: true,
		imageSizes: [
			{
				name: 'thumbnail',
				width: 300,
			},
			{
				name: 'square',
				width: 500,
				height: 500,
			},
			{
				name: 'small',
				width: 600,
			},
			{
				name: 'medium',
				width: 900,
			},
			{
				name: 'large',
				width: 1400,
			},
			{
				name: 'xlarge',
				width: 1920,
			},
			{
				name: 'og',
				width: 1200,
				height: 630,
				crop: 'center',
			},
		],
	},
}
