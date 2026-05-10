import type { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'confirmed', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'confirmed',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Toggle off to stop sending notifications to this address.',
      },
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        description: 'Where the subscription came from (e.g. "homepage").',
        readOnly: true,
      },
    },
  ],
}
