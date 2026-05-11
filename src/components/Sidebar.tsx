import { SubscribeForm } from './SubscribeForm'
import { FilterButtons } from './FilterButtons'

type Maybe<T> = T | null | undefined

type ProfileData = {
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
  const name = profile.name ?? 'Your Name'
  const role = profile.role ?? undefined
  const bio = profile.bio ?? undefined
  const awards = profile.awards ?? []
  const services = profile.services ?? []
  const socials = profile.socials ?? []
  const filterList = filters ?? []

  return (
    <aside className="flex flex-col gap-3 md:gap-4">
      <Card>
        <h1 className="text-4xl md:text-5xl font-delight font-bold tracking-tight">
          {name === 'This is not a blog' ? (
            <>This is not<br />a blog</>
          ) : name}
        </h1>
      </Card>

      {(role || bio || filterList.length > 0) && (
        <Card>
          {(role || bio) && (
            <p className="text-base md:text-[15px] leading-relaxed text-ink/90">
              {role && <span className="font-medium">{role}</span>}
              {role && bio ? ' — ' : ''}
              {bio}
            </p>
          )}

          {filterList.length > 0 && (
            <div className="mt-6">
              <div className="text-sm text-muted mb-2">Secciones:</div>
              <FilterButtons filters={filterList} activeFilter={activeFilter ?? null} />
            </div>
          )}
        </Card>
      )}

      <Card>
        <SubscribeForm />
      </Card>

      {(awards.length > 0 || services.length > 0 || socials.length > 0) && (
        <Card>
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              {awards.length > 0 && (
                <>
                  <div className="text-ink mb-3">Awards</div>
                  <ul className="space-y-1.5 text-muted">
                    {awards.map((a, i) => (
                      <li key={a.id ?? i}>{a.label}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div>
              {services.length > 0 && (
                <>
                  <div className="text-ink mb-3">Services</div>
                  <ul className="space-y-1.5 text-muted">
                    {services.map((s, i) => (
                      <li key={s.id ?? i}>{s.label}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
            <div>
              {socials.length > 0 && (
                <>
                  <div className="text-ink mb-3">Socials</div>
                  <ul className="space-y-1.5 text-muted">
                    {socials.map((s, i) => (
                      <li key={s.id ?? i}>
                        <a
                          href={s.href ?? '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-ink transition-colors"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </Card>
      )}
    </aside>
  )
}
