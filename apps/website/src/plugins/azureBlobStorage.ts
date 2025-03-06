import { azureStorage } from '@payloadcms/storage-azure'

const collections = { media: true } as const

const plugin = azureStorage({
	collections: process.env.NODE_ENV !== 'production' ? {} : collections,
	allowContainerCreate: false,
	baseURL: process.env.AZURE_STORAGE_ACCOUNT_BASEURL ?? '',
	connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING ?? '',
	containerName: process.env.AZURE_STORAGE_CONTAINER_NAME ?? '',
})

export default plugin
