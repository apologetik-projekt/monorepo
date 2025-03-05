import type { AccessArgs } from 'payload'
import type { User } from '#/types/payload'

type isAuthenticated = (args: AccessArgs<User>) => boolean

export const isEditor: isAuthenticated = ({ req: { user } }) => {
  return Boolean(user?.role === 'editor')
}
