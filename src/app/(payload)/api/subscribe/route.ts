import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: Request) {
  let body: { email?: string; source?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = (body.email || '').trim().toLowerCase()
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email' }, { status: 400 })
  }

  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'subscribers',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })

  if (existing.docs.length) {
    return NextResponse.json({ ok: true, alreadySubscribed: true })
  }

  await payload.create({
    collection: 'subscribers',
    data: {
      email,
      confirmed: true,
      source: body.source || 'homepage',
    },
    overrideAccess: true,
  })

  return NextResponse.json({ ok: true })
}
