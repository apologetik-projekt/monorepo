import { azureStorage } from '@payloadcms/storage-azure'
const plugin = azureStorage({
	collections: {
		media: process.env.NODE_ENV == 'production' ? true : undefined,
	},
	allowContainerCreate: false,
	baseURL: process.env.AZURE_STORAGE_ACCOUNT_BASEURL ?? '',
	connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING ?? '',
	containerName: process.env.AZURE_STORAGE_CONTAINER_NAME ?? '',
})

export default plugin
