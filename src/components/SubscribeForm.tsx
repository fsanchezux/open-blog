'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'already' | 'error'

export function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setMessage(null)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'sidebar' }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus('error')
        setMessage(data?.error || 'Something went wrong, please try again.')
        return
      }
      if (data?.alreadySubscribed) {
        setStatus('already')
        setMessage("You're already subscribed — thanks!")
      } else {
        setStatus('success')
        setMessage("You're in. I'll email you when a new post goes up.")
        setEmail('')
      }
    } catch (err) {
      setStatus('error')
      setMessage('Network error — please try again.')
    }
  }

  return (
    <div>
      <div className="text-ink mb-2 text-sm font-medium">Subscribe</div>
      <p className="text-sm text-muted mb-4">
        Get an email when a new post is published.
      </p>
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 px-4 py-2 rounded-full border border-line bg-bg text-sm focus:outline-none focus:ring-1 focus:ring-ink"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-line hover:bg-bg transition-colors text-sm disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending…' : 'Subscribe'}
        </button>
      </form>
      {message && (
        <p
          className={`mt-3 text-xs ${
            status === 'error' ? 'text-red-600' : 'text-muted'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}
