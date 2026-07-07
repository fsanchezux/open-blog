import type { CollectionConfig } from 'payload'

import { notifySubscribersOfPost } from '../lib/notify'

const slugify = (value: string) =>
  value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const POST_CATEGORIES = [
  { label: 'Lettering curator', value: 'lettering-curator' },
  { label: "Don't judge a book by its cover", value: 'dont-judge-a-book-by-its-cover' },
  { label: 'Music curator', value: 'music-curator' },
] as const

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'updatedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        and: [
          { _status: { equals: 'published' } },
          {
            or: [
              { publishedAt: { less_than_equal: new Date().toISOString() } },
              { publishedAt: { exists: false } },
            ],
          },
        ],
      } as any
    },
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req, operation }) => {
        try {
          const isPublished = doc?._status === 'published'
          if (!isPublished) return

          const wasPublished = previousDoc?._status === 'published'
          const publishedAt = doc?.publishedAt ? new Date(doc.publishedAt) : null
          const isScheduled = publishedAt ? publishedAt.getTime() > Date.now() : false

          if (doc?.notificationSent) return
          if (isScheduled) return

          if (operation === 'create' || !wasPublished || !previousDoc) {
            void notifySubscribersOfPost(req.payload, doc).catch((err) =>
              req.payload.logger.error({ err }, 'Failed to notify subscribers'),
            )
          }
        } catch (err) {
          req.payload.logger.error({ err }, 'Failed to schedule subscriber notification')
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL-friendly identifier (e.g. "my-first-project")',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            if (data?.title) return slugify(data.title)
            return value
          },
        ],
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Cover image shown in the grid',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: POST_CATEGORIES as unknown as { label: string; value: string }[],
      admin: {
        position: 'sidebar',
        description: 'Used by the sidebar filter buttons',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description:
          'Set a future date to schedule the post — it will only be visible to readers after that moment.',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'notificationSent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Internal — flips to true once subscribers have been emailed.',
        readOnly: true,
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'gallery',
      type: 'array',
      labels: {
        singular: 'Image',
        plural: 'Gallery images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
  ],
}
