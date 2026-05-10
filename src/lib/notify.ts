import type { Payload } from 'payload'

type AnyPost = {
  id: string | number
  title?: string | null
  subtitle?: string | null
  slug?: string | null
}

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

export async function sendEmail(opts: {
  to: string | string[]
  subject: string
  html: string
}): Promise<{ ok: boolean; status?: number; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM || 'Blog <onboarding@resend.dev>'

  if (!apiKey) {
    console.warn('[notify] RESEND_API_KEY not set — skipping email send', {
      to: opts.to,
      subject: opts.subject,
    })
    return { ok: false, error: 'RESEND_API_KEY not configured' }
  }

  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: Array.isArray(opts.to) ? opts.to : [opts.to],
      subject: opts.subject,
      html: opts.html,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    return { ok: false, status: res.status, error: text || res.statusText }
  }
  return { ok: true, status: res.status }
}

function renderPostEmail(post: AnyPost, baseUrl: string): { subject: string; html: string } {
  const title = post.title || 'New post'
  const subtitle = post.subtitle || ''
  const url = `${baseUrl.replace(/\/$/, '')}/posts/${post.slug ?? ''}`
  const subject = `New post: ${title}`
  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; max-width: 560px; margin: 0 auto; color: #111;">
      <h1 style="font-size: 22px; margin: 0 0 12px;">${escapeHtml(title)}</h1>
      ${subtitle ? `<p style="color:#555; margin: 0 0 16px;">${escapeHtml(subtitle)}</p>` : ''}
      <p style="margin: 24px 0;">
        <a href="${url}" style="background:#111; color:#fff; padding:10px 18px; border-radius:999px; text-decoration:none; font-size:14px;">Read the post</a>
      </p>
      <p style="font-size:12px; color:#999;">You're receiving this because you subscribed to the blog.</p>
    </div>
  `
  return { subject, html }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function notifySubscribersOfPost(payload: Payload, post: AnyPost): Promise<number> {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const subscribers = await payload.find({
    collection: 'subscribers',
    where: { confirmed: { equals: true } },
    limit: 1000,
    depth: 0,
  })

  if (!subscribers.docs.length) {
    payload.logger.info('[notify] No subscribers to notify')
    await markSent(payload, post.id)
    return 0
  }

  const { subject, html } = renderPostEmail(post, baseUrl)

  let sent = 0
  for (const sub of subscribers.docs as Array<{ email: string }>) {
    const result = await sendEmail({ to: sub.email, subject, html })
    if (result.ok) sent += 1
    else payload.logger.warn({ email: sub.email, error: result.error }, '[notify] Failed to send')
  }

  await markSent(payload, post.id)
  payload.logger.info(`[notify] Sent post "${post.title}" to ${sent}/${subscribers.docs.length}`)
  return sent
}

async function markSent(payload: Payload, postId: string | number) {
  try {
    await payload.update({
      collection: 'posts',
      id: postId,
      data: { notificationSent: true },
      overrideAccess: true,
      context: { skipNotify: true },
    })
  } catch (err) {
    payload.logger.error({ err }, '[notify] Failed to mark notificationSent')
  }
}
