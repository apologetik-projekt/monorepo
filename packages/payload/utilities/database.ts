export function getConnectionString() {
	if (process.env.DATABASE_URI) return process.env.DATABASE_URI
	const USER = process.env.DB_USER || 'postgres'
	const PASSWORD = process.env.DB_PASSWORD || 'postgres'
	const HOST = process.env.DB_HOST || 'localhost'
	const PORT = process.env.DB_PORT || '5432'
	const NAME = process.env.DB_NAME || 'payload'
	return `postgres://${USER}:${PASSWORD}@${HOST}:${PORT}/${NAME}`
}
