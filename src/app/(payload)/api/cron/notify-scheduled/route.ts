import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

import { notifySubscribersOfPost } from '@/lib/notify'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const authHeader = req.headers.get('authorization') || ''
    const url = new URL(req.url)
    const queryToken = url.searchParams.get('token') || ''
    const provided = authHeader.replace(/^Bearer\s+/i, '') || queryToken
    if (provided !== secret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const payload = await getPayload({ config })
  const now = new Date().toISOString()

  const due = await payload.find({
    collection: 'posts',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { notificationSent: { not_equals: true } },
        { publishedAt: { less_than_equal: now } },
      ],
    },
    limit: 50,
    depth: 0,
    overrideAccess: true,
  })

  const results: Array<{ id: string | number; sent: number }> = []
  for (const post of due.docs as any[]) {
    const sent = await notifySubscribersOfPost(payload, post)
    results.push({ id: post.id, sent })
  }

  return NextResponse.json({ ok: true, processed: results.length, results })
}
