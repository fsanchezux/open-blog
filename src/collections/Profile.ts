import type { GlobalConfig } from 'payload'

export const Profile: GlobalConfig = {
  slug: 'profile',
  label: 'Profile (sidebar)',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Your Name',
    },
    {
      name: 'role',
      type: 'text',
      admin: {
        description: 'Short role line shown in the sidebar (e.g. "Product designer at Metalab")',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'Short paragraph shown under your name',
      },
    },
    {
      name: 'location',
      type: 'text',
      admin: {
        description: 'e.g. "Denmark" — shown next to the live clock',
      },
    },
    {
      name: 'timezone',
      type: 'text',
      defaultValue: 'Europe/Madrid',
      admin: {
        description: 'IANA timezone (e.g. "Europe/Madrid", "Europe/Copenhagen")',
      },
    },
    {
      name: 'cta',
      type: 'group',
      label: 'CTA button',
      fields: [
        { name: 'label', type: 'text', defaultValue: "Let's talk" },
        { name: 'href', type: 'text', defaultValue: 'mailto:hi@example.com' },
      ],
    },
    {
      name: 'awards',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'services',
      type: 'array',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'socials',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
  ],
}
