'use client'

import { useState } from 'react'
import { SubscribeForm } from './SubscribeForm'
import { FilterButtons } from './FilterButtons'

type Maybe<T> = T | null | undefined

export type ProfileData = {
  name?: Maybe<string>
  role?: Maybe<string>
  bio?: Maybe<string>
  awards?: Maybe<{ label?: Maybe<string>; id?: Maybe<string> }[]>
  services?: Maybe<{ label?: Maybe<string>; id?: Maybe<string> }[]>
  socials?: Maybe<{ label?: Maybe<string>; href?: Maybe<string>; id?: Maybe<string> }[]>
}

type Filter = { label: string; value: string }

const Card = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={`bg-card rounded-card p-6 md:p-7 ${className}`}>{children}</div>
)

export function Sidebar({
  profile,
  activeFilter,
  filters,
}: {
  profile: ProfileData
  activeFilter?: string | null
  filters?: Filter[]
}) {
  const [showSubscribe, setShowSubscribe] = useState(false)
  
  const name = profile.name ?? 'Your Name'
  const role = profile.role ?? undefined
  const bio = profile.bio ?? undefined
  const filterList = filters ?? []

  return (
    <aside className="flex flex-col gap-3 md:gap-4 pb-24 md:pb-0">
      <Card>
        <h1 className="text-4xl md:text-5xl font-delight font-bold tracking-tight">
          {name === 'This is not a blog' ? (
            <>This is not<br />a blog</>
          ) : name}
        </h1>
      </Card>

      {(role || bio) && (
        <Card>
          <p className="text-base md:text-[15px] leading-relaxed text-ink/90">
            {role && <span className="font-medium">{role}</span>}
            {role && bio ? ' — ' : ''}
            {bio}
          </p>
        </Card>
      )}

      {filterList.length > 0 && (
        <Card className="hidden md:block">
          <div className="text-sm text-muted mb-2">Secciones:</div>
          <FilterButtons filters={filterList} activeFilter={activeFilter ?? null} />
        </Card>
      )}

      {filterList.length > 0 && (
        <div className="md:hidden">
          <FilterButtons filters={filterList} activeFilter={activeFilter ?? null} />
        </div>
      )}

      <Card className="hidden md:block">
        <SubscribeForm />
      </Card>

      <button
        className="md:hidden fixed bottom-6 right-6 z-50 bg-ink text-bg rounded-full p-4 shadow-xl hover:scale-105 transition-transform"
        onClick={() => setShowSubscribe(true)}
        aria-label="Subscribe"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3Z"/><path d="M4.5 3h15a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 15.5v-11A1.5 1.5 0 0 1 4.5 3Z"/></svg>
      </button>

      {showSubscribe && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowSubscribe(false)}>
          <div className="bg-card w-full sm:max-w-md p-6 rounded-t-2xl sm:rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-delight font-bold">Subscribe</h3>
              <button onClick={() => setShowSubscribe(false)} className="text-muted hover:text-ink">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <SubscribeForm />
          </div>
        </div>
      )}
    </aside>
  )
}
