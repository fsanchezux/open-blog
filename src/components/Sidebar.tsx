import { Clock } from './Clock'

type Maybe<T> = T | null | undefined

type ProfileData = {
  name?: Maybe<string>
  role?: Maybe<string>
  bio?: Maybe<string>
  location?: Maybe<string>
  timezone?: Maybe<string>
  cta?: Maybe<{ label?: Maybe<string>; href?: Maybe<string> }>
  awards?: Maybe<{ label?: Maybe<string>; id?: Maybe<string> }[]>
  services?: Maybe<{ label?: Maybe<string>; id?: Maybe<string> }[]>
  socials?: Maybe<{ label?: Maybe<string>; href?: Maybe<string>; id?: Maybe<string> }[]>
}

const Card = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={`bg-card rounded-card p-6 md:p-7 ${className}`}>{children}</div>
)

export function Sidebar({ profile }: { profile: ProfileData }) {
  const name = profile.name ?? 'Your Name'
  const role = profile.role ?? undefined
  const bio = profile.bio ?? undefined
  const location = profile.location ?? undefined
  const timezone = profile.timezone ?? 'Europe/Madrid'
  const cta = profile.cta ?? undefined
  const awards = profile.awards ?? []
  const services = profile.services ?? []
  const socials = profile.socials ?? []

  return (
    <aside className="flex flex-col gap-3 md:gap-4">
      <Card>
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight">{name}</h1>
      </Card>

      {(role || bio || cta?.label) && (
        <Card>
          {(role || bio) && (
            <p className="text-base md:text-[15px] leading-relaxed text-ink/90">
              {role && <span className="font-medium">{role}</span>}
              {role && bio ? ' — ' : ''}
              {bio}
            </p>
          )}
          {cta?.label && cta?.href && (
            <a
              href={cta.href}
              className="inline-flex mt-6 items-center px-5 py-2 rounded-full border border-line hover:bg-bg transition-colors text-sm"
            >
              {cta.label}
            </a>
          )}
        </Card>
      )}

      <Card>
        <Clock timezone={timezone} location={location} />
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
