'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

type PostCard = {
  id: string | number
  slug: string
  title: string
  subtitle?: string
  cover?: {
    url?: string
    alt?: string
    width?: number
    height?: number
    sizes?: {
      card?: { url?: string; width?: number; height?: number }
    }
  } | null
}

export function PostsGrid({ posts }: { posts: PostCard[] }) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { gsap } = await import('gsap')
      if (!mounted || !gridRef.current) return
      const items = gridRef.current.querySelectorAll<HTMLElement>('[data-card]')
      gsap.fromTo(
        items,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.06,
        },
      )
    })()
    return () => {
      mounted = false
    }
  }, [posts.length])

  if (!posts.length) {
    return null
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 auto-rows-[minmax(0,1fr)]"
    >
      {posts.map((post) => {
        const url = post.cover?.sizes?.card?.url || post.cover?.url
        const w = post.cover?.sizes?.card?.width || post.cover?.width || 900
        const h = post.cover?.sizes?.card?.height || post.cover?.height || 1100
        return (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            data-card
            className="group relative block overflow-hidden rounded-card bg-card aspect-[4/5]"
          >
            {url && (
              <Image
                src={url}
                alt={post.cover?.alt || post.title}
                width={w}
                height={h}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/60 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-sm font-medium">{post.title}</div>
              {post.subtitle && <div className="text-xs opacity-80">{post.subtitle}</div>}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
