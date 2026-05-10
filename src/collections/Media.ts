import path from 'path'
import os from 'os'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
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
