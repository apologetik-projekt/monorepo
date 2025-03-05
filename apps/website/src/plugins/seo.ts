import { seoPlugin } from '@payloadcms/plugin-seo'
import type { Page, Post } from '#/types/payload'
import type {
  GenerateDescription,
  GenerateImage,
  GenerateTitle,
  GenerateURL,
} from '@payloadcms/plugin-seo/types'

type CollectionWithSEO = Page | Post

export const generateTitle: GenerateTitle<CollectionWithSEO> = ({ doc }) => {
  return doc?.title ? `${doc.title}` : 'Das Apologetik Projekt - Christliche Apologetik'
}

export const generateURL: GenerateURL<CollectionWithSEO> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const getServerSideURL = () => {
  let url = process.env.NEXT_PUBLIC_SERVER_URL

  if (!url) {
    url = 'http://localhost:3000'
  }

  return url
}

export const generateImage: GenerateImage<Post> = async ({ doc }) => {
  return typeof doc.coverImage == 'number' ? String(doc.coverImage) : ''
}

export const generateDescription: GenerateDescription<CollectionWithSEO> = ({ doc }) => {
  if (doc && 'description' in doc && doc.description) {
    return doc.description
  }
  return ''
}

const plugin = seoPlugin({
  generateTitle,
  generateURL,
  generateImage,
  generateDescription,
})
export default plugin
