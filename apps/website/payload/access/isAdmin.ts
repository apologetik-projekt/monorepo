import type { User } from '#/types/payload'
import type { AccessArgs } from 'payload'

type isAuthenticated = (args: AccessArgs<User>) => boolean

export const isAdmin: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user?.role?.includes('admin'))
}
