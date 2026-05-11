import type { ProfileData } from './Sidebar'

type Maybe<T> = T | null | undefined

export function Footer({ profile }: { profile: ProfileData }) {
  const awards = profile.awards ?? []
  const services = profile.services ?? []
  const socials = profile.socials ?? []

  if (awards.length === 0 && services.length === 0 && socials.length === 0) return null

  return (
    <footer className="mt-12 border-t border-line pt-8 pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
        {awards.length > 0 && (
          <div>
            <div className="text-ink mb-3 font-medium">Awards</div>
            <ul className="space-y-1.5 text-muted">
              {awards.map((a, i) => (
                <li key={a.id ?? i}>{a.label}</li>
              ))}
            </ul>
          </div>
        )}
        {services.length > 0 && (
          <div>
            <div className="text-ink mb-3 font-medium">Services</div>
            <ul className="space-y-1.5 text-muted">
              {services.map((s, i) => (
                <li key={s.id ?? i}>{s.label}</li>
              ))}
            </ul>
          </div>
        )}
        {socials.length > 0 && (
          <div>
            <div className="text-ink mb-3 font-medium">Socials</div>
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
          </div>
        )}
      </div>
    </footer>
  )
}
