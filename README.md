# Blog — Payload CMS + Next.js + Tailwind + GSAP

Personal blog / portfolio with a minimalist sidebar + grid layout.
Inspired by [lorenzocabra.xyz](https://lorenzocabra.xyz/).

- **CMS:** Payload v3 (panel at `/admin`)
- **Frontend:** Next.js 15 App Router + Tailwind CSS
- **Animations:** GSAP (grid stagger + scroll reveals)
- **DB:** Postgres (Neon / Supabase / Vercel Postgres)
- **Media:** Vercel Blob in production, local disk in dev
- **Hosting:** Vercel-ready

## Features

- Left sidebar (name, role, bio, live clock, awards, services, socials)
- Right grid with project covers
- Click a card → full post page (title, subtitle, rich text, image gallery)
- Fully responsive
- All sidebar content edited in `/admin` → "Profile (sidebar)"
- All projects edited in `/admin` → "Posts"

---

## 1. First-time setup

### Install dependencies

```bash
npm install
```

> If you prefer pnpm/yarn, both work fine — just delete `package-lock.json` first.

### Get a Postgres database (free)

The easiest free option: **[Neon](https://neon.tech)**.

1. Create a project.
2. Copy the connection string (looks like `postgres://user:pass@host/dbname?sslmode=require`).

### Create `.env`

Copy `.env.example` → `.env` and fill in:

```env
PAYLOAD_SECRET=<run: openssl rand -base64 32>
DATABASE_URI=postgres://...
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
# BLOB_READ_WRITE_TOKEN= leave empty for local dev
```

### Run dev server

```bash
npm run dev
```

Then open:

- **Frontend:** http://localhost:3000
- **Admin:** http://localhost:3000/admin

The first time you load `/admin`, it will ask you to create the first user.

---

## 2. Adding content

### Sidebar

Go to `/admin` → **Globals → Profile (sidebar)** and fill in:

- Name, role, bio
- Location (e.g. "Madrid") + timezone (e.g. "Europe/Madrid")
- CTA button label + link (e.g. `mailto:you@example.com`)
- Awards / services / social links (each is a list)

### Projects (posts)

Go to `/admin` → **Collections → Posts → Create new**. Each post has:

- **Title** (required)
- **Subtitle** (optional)
- **Slug** (auto-generated from title)
- **Cover image** — what shows up in the grid
- **Tags**, **published date**
- **Content** — rich text body
- **Gallery** — multiple images shown below the body

Set the post status to **Published** and hit Save.

---

## 3. Deploying to Vercel

### Quick path

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → New Project → import the repo.
3. Add the following environment variables in the Vercel project settings:

   | Key                        | Value                                   |
   | -------------------------- | --------------------------------------- |
   | `PAYLOAD_SECRET`           | Long random string                      |
   | `DATABASE_URI`             | Your Neon / Supabase Postgres URL       |
   | `NEXT_PUBLIC_SERVER_URL`   | `https://your-domain.vercel.app`        |
   | `BLOB_READ_WRITE_TOKEN`    | (see below)                             |

4. **Set up Vercel Blob** (for image uploads in production):
   - Vercel dashboard → your project → **Storage** → **Create Database** → **Blob**.
   - Once created, Vercel automatically injects `BLOB_READ_WRITE_TOKEN` into the project env.
   - The Payload media collection is already wired to Vercel Blob via `@payloadcms/storage-vercel-blob`.

5. Deploy. Once live, open `https://your-domain.vercel.app/admin` and create your admin user.

> Tip: in `next.config.mjs` the `images.remotePatterns` is already configured for Vercel Blob domains.

---

## 4. Project structure

```
src/
├── app/
│   ├── (frontend)/          ← public site (your blog)
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── page.tsx         ← home: sidebar + grid
│   │   └── posts/[slug]/    ← single post page
│   └── (payload)/           ← admin panel & API
│       ├── admin/[[...segments]]/
│       └── api/[...slug]/
├── collections/
│   ├── Posts.ts
│   ├── Media.ts
│   ├── Users.ts
│   └── Profile.ts           ← global = sidebar content
├── components/
│   ├── Sidebar.tsx
│   ├── Clock.tsx            ← live clock with timezone
│   ├── PostsGrid.tsx        ← GSAP-animated grid
│   ├── PostGallery.tsx      ← GSAP scroll reveals
│   └── RichText.tsx         ← Lexical → React renderer
└── payload.config.ts
```

---

## 5. Customization tips

- **Colors / radius / fonts:** edit `tailwind.config.ts` (the `bg`, `card`, `ink`, `muted` colors and `card` border-radius).
- **Animation tweaks:** `src/components/PostsGrid.tsx` and `PostGallery.tsx`.
- **Add fields to a post** (e.g. video URL, external link): edit `src/collections/Posts.ts` and re-run `npm run dev`.

---

## Useful scripts

```bash
npm run dev              # start dev server
npm run build            # production build
npm run start            # start production server
npm run generate:types   # regenerate src/payload-types.ts after collection changes
```
