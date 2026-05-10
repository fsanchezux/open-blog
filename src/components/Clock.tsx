'use client'

import { useEffect, useState } from 'react'

export function Clock({ timezone, location }: { timezone: string; location?: string }) {
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const update = () => {
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: timezone,
        })
        setTime(formatter.format(new Date()))
      } catch {
        setTime(new Date().toLocaleTimeString())
      }
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [timezone])

  return (
    <div className="text-2xl md:text-3xl font-medium tracking-tight">
      <span suppressHydrationWarning>{time || ' '}</span>
      {location && <span className="text-muted"> / {location}</span>}
    </div>
  )
}
