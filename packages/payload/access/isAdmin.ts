import type { User } from '../types'
import type { AccessArgs } from 'payload'

type isAuthenticated = (args: AccessArgs<User>) => boolean

export const isAdmin: isAuthenticated = ({ req: { user } }) => {
	return Boolean(user?.role?.includes('admin'))
}
