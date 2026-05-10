import { getPayload } from 'payload'
import config from '@payload-config'

import { Sidebar } from '@/components/Sidebar'
import { PostsGrid } from '@/components/PostsGrid'
import { POST_CATEGORIES } from '@/collections/Posts'

export const dynamic = 'force-dynamic'

const VALID_FILTERS = new Set(POST_CATEGORIES.map((c) => c.value))

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter } = await searchParams
  const activeFilter = filter && VALID_FILTERS.has(filter as any) ? filter : null
  const payload = await getPayload({ config })

  const nowIso = new Date().toISOString()
  const where: any = {
    and: [
      { _status: { equals: 'published' } },
      {
        or: [
          { publishedAt: { less_than_equal: nowIso } },
          { publishedAt: { exists: false } },
        ],
      },
    ],
  }
  if (activeFilter) {
    where.and.push({ category: { equals: activeFilter } })
  }

  const [profile, postsRes] = await Promise.all([
    payload.findGlobal({ slug: 'profile' }).catch(() => null),
    payload.find({
      collection: 'posts',
      sort: '-publishedAt',
      depth: 1,
      limit: 50,
      where,
    }),
  ])

  const posts = postsRes.docs.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    cover:
      typeof p.cover === 'object' && p.cover !== null
        ? {
            url: p.cover.url,
            alt: p.cover.alt,
            width: p.cover.width,
            height: p.cover.height,
            sizes: p.cover.sizes,
          }
        : null,
  }))

  return (
    <main className="mx-auto max-w-[1600px] px-3 md:px-4 py-3 md:py-4">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] gap-3 md:gap-4">
        <Sidebar
          profile={profile || {}}
          activeFilter={activeFilter}
          filters={POST_CATEGORIES.map((c) => ({ label: c.label, value: c.value }))}
        />
        <section>
          <PostsGrid posts={posts} />
        </section>
      </div>
    </main>
  )
}
