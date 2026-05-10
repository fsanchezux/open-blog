'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

type Item = {
  url: string
  alt?: string
  width?: number
  height?: number
  caption?: string
}

export function PostGallery({ items }: { items: Item[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      if (!mounted || !ref.current) return
      const figs = ref.current.querySelectorAll<HTMLElement>('figure')
      figs.forEach((f) => {
        gsap.fromTo(
          f,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: f,
              start: 'top 85%',
              once: true,
            },
          },
        )
      })
    })()
    return () => {
      mounted = false
    }
  }, [items.length])

  if (!items.length) return null

  return (
    <div ref={ref} className="flex flex-col gap-3 md:gap-4 mt-6">
      {items.map((item, i) => (
        <figure key={i} className="bg-card rounded-card overflow-hidden">
          <Image
            src={item.url}
            alt={item.alt || ''}
            width={item.width || 1600}
            height={item.height || 1000}
            className="w-full h-auto"
            sizes="(max-width: 1024px) 100vw, 1100px"
          />
          {item.caption && (
            <figcaption className="px-6 py-3 text-sm text-muted">{item.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}
