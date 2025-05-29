import { azureStorage } from '@payloadcms/storage-azure'

const collections = { media: true } as const

export default azureStorage({
	collections: collections,
	allowContainerCreate: false,
	enabled: process.env.NODE_ENV == 'production',
	baseURL: process.env.AZURE_STORAGE_ACCOUNT_BASEURL ?? '',
	connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING ?? '',
	containerName: process.env.AZURE_STORAGE_CONTAINER_NAME ?? '',
})
