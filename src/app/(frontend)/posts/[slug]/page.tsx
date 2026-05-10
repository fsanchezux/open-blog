import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { RichText } from '@/components/RichText'
import { PostGallery } from '@/components/PostGallery'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const post = res.docs[0]
  if (!post) return {}
  return {
    title: post.title,
    description: post.subtitle || undefined,
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const res = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    depth: 2,
    limit: 1,
  })
  const post = res.docs[0] as any
  if (!post) notFound()

  const cover = typeof post.cover === 'object' ? post.cover : null
  const coverUrl = cover?.sizes?.feature?.url || cover?.url
  const coverW = cover?.sizes?.feature?.width || cover?.width || 1600
  const coverH = cover?.sizes?.feature?.height || cover?.height || 900

  const gallery: any[] = Array.isArray(post.gallery)
    ? post.gallery
        .map((g: any) => {
          const img = typeof g.image === 'object' ? g.image : null
          if (!img) return null
          return {
            url: img.sizes?.feature?.url || img.url,
            alt: img.alt,
            width: img.sizes?.feature?.width || img.width,
            height: img.sizes?.feature?.height || img.height,
            caption: g.caption,
          }
        })
        .filter(Boolean)
    : []

  return (
    <main className="mx-auto max-w-[1100px] px-3 md:px-4 py-3 md:py-6">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink transition-colors"
        >
          <span aria-hidden>←</span> Back
        </Link>
      </div>

      <article className="bg-card rounded-card p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-5xl font-medium tracking-tight">{post.title}</h1>
          {post.subtitle && (
            <p className="mt-3 text-lg md:text-xl text-muted">{post.subtitle}</p>
          )}
          {post.publishedAt && (
            <p className="mt-4 text-sm text-muted">
              {new Date(post.publishedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </header>

        {coverUrl && (
          <div className="rounded-card overflow-hidden mb-8">
            <Image
              src={coverUrl}
              alt={cover?.alt || post.title}
              width={coverW}
              height={coverH}
              className="w-full h-auto"
              priority
              sizes="(max-width: 1024px) 100vw, 1100px"
            />
          </div>
        )}

        {post.content && <RichText data={post.content} />}
      </article>

      <PostGallery items={gallery} />
    </main>
  )
}
