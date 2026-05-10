import path from 'path'
import os from 'os'
import type { CollectionConfig } from 'payload'

const CLOUDINARY_FOLDER = 'open-blog/media'

const stripExt = (filename: string) => filename.replace(/\.[^/.]+$/, '')

const cloudinaryUrl = (filename: string): string | null => {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME
  if (!cloud) return null
  const publicId = `${CLOUDINARY_FOLDER}/${stripExt(filename)}`
  const encoded = publicId.split('/').map(encodeURIComponent).join('/')
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto/${encoded}`
}

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (!doc) return doc
        if (doc.filename) {
          const url = cloudinaryUrl(doc.filename)
          if (url) doc.url = url
        }
        if (doc.sizes && typeof doc.sizes === 'object') {
          for (const key of Object.keys(doc.sizes)) {
            const size = doc.sizes[key]
            if (size?.filename) {
              const url = cloudinaryUrl(size.filename)
              if (url) size.url = url
            }
          }
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
    {
      name: 'caption',
      type: 'text',
    },
  ],
  upload: {
    staticDir: path.join(os.tmpdir(), 'payload-media'),
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'card',
        width: 900,
        height: undefined,
        position: 'centre',
      },
      {
        name: 'feature',
        width: 1600,
        height: undefined,
        position: 'centre',
      },
    ],
  },
}
