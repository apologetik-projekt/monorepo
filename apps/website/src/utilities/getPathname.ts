import { headers } from 'next/headers'

export async function getServerSidePathname() {
  const reqHeaders = await headers()
  return reqHeaders.get('x-pathname') ?? undefined
}
