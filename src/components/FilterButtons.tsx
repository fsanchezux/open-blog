'use client'

import Link from 'next/link'

type Filter = { label: string; value: string }

export function FilterButtons({
  filters,
  activeFilter,
}: {
  filters: Filter[]
  activeFilter: string | null
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/"
        scroll={false}
        aria-pressed={activeFilter === null}
        className={`inline-flex items-center px-5 py-2 rounded-full border text-sm transition-colors ${
          activeFilter === null
            ? 'bg-ink text-bg border-ink'
            : 'border-line hover:bg-bg'
        }`}
      >
        Home
      </Link>
      {filters.map((f) => {
        const isActive = activeFilter === f.value
        const href = isActive ? '/' : `/?filter=${encodeURIComponent(f.value)}`
        return (
          <Link
            key={f.value}
            href={href}
            scroll={false}
            aria-pressed={isActive}
            className={`inline-flex items-center px-5 py-2 rounded-full border text-sm transition-colors ${
              isActive
                ? 'bg-ink text-bg border-ink'
                : 'border-line hover:bg-bg'
            }`}
          >
            {f.label}
          </Link>
        )
      })}
    </div>
  )
}
