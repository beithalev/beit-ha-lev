# Beit Ha Lev — בֵּית הַלֵּב

> A home for the heart. Live Torah study + values-first Jewish matchmaking.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend + API | Next.js 14 (App Router, TypeScript) |
| Database + Auth | Supabase (PostgreSQL + Realtime) |
| Video/Audio | Jitsi Meet (meet.jit.si or self-hosted) |
| Styling | Tailwind CSS |
| Matching | Weighted compatibility algorithm (lib/matching/algorithm.ts) |

---

## Local Setup (5 minutes)

### 1. Install dependencies

```bash
cd beit-ha-lev
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Note your **Project URL** and **anon/public API key** (Settings → API)

### 3. Run the database schema

In your Supabase dashboard → **SQL Editor** → **New query**, paste the contents of `supabase/schema.sql` and run it.

Then enable **Realtime** for live chat:
- Dashboard → **Database** → **Replication**
- Toggle on `classroom_messages` and `match_messages`

### 4. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your Supabase URL and anon key.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're live.

---

## Project Structure

```
beit-ha-lev/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── auth/
│   │   ├── login/                # Login
│   │   ├── register/             # Registration (role picker + details)
│   │   └── onboarding/           # Post-signup confirmation
│   ├── torah/
│   │   ├── page.tsx              # Classroom listing
│   │   ├── create/               # Create a new room (rabbi)
│   │   └── [roomId]/             # Live room: Jitsi + chat sidebar
│   ├── shidduch/
│   │   ├── page.tsx              # Match dashboard
│   │   ├── questionnaire/        # 5-step onboarding questionnaire
│   │   └── matches/
│   │       ├── page.tsx          # AI-ranked suggestions
│   │       └── [matchId]/        # Private chat with a match
│   └── api/                      # REST endpoints (classrooms, matches, profile)
├── components/
│   ├── layout/Navbar.tsx
│   ├── torah/
│   │   ├── JitsiRoom.tsx         # Jitsi Meet iframe wrapper
│   │   └── ChatSidebar.tsx       # Realtime chat (Supabase Realtime)
│   └── shidduch/
│       ├── MatchSuggestions.tsx  # Swipeable match cards
│       └── MatchChat.tsx         # Private match messaging
├── lib/
│   ├── supabase/                 # Browser + server Supabase clients
│   ├── matching/algorithm.ts     # Compatibility scoring engine
│   └── utils.ts
├── types/index.ts                # All TypeScript interfaces
├── supabase/schema.sql           # Full DB schema + RLS policies
└── middleware.ts                 # Route protection
```

---

## Features

### Torah Study
- **Live classrooms** created by rabbis, joinable by anyone
- **Jitsi Meet** embedded — full camera, mic, screen share, raise hand
- **Realtime chat** sidebar powered by Supabase Realtime (no page refresh)
- Classrooms show topic, description, live badge, participant count

### Shidduch
- **No photos** — identity is protected until both parties choose to connect
- **5-step questionnaire**: personal info, observance, life goals, partner prefs, bio
- **Weighted matching algorithm** (`lib/matching/algorithm.ts`):
  - Denomination compatibility (spectrum-based)
  - Shabbat & kashrut observance (scale similarity)
  - Life goal alignment (aliyah, children, family size)
  - Values overlap (shared tags)
  - Age & geographic flexibility
  - Min 30% threshold to appear in suggestions
- **Express interest / pass** flow → mutual interest opens private messaging
- **Private realtime chat** between accepted matches

---

## Deploying to Production

### Recommended: Vercel + Supabase

```bash
npm install -g vercel
vercel
```

Set the same env vars in Vercel dashboard (Settings → Environment Variables).

Update your Supabase project's **Authentication → URL Configuration**:
- Site URL: `https://your-app.vercel.app`
- Redirect URLs: `https://your-app.vercel.app/**`

### Self-hosted Jitsi (optional)

For a fully private/branded video experience, deploy [Jitsi Meet](https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-quickstart) on a VPS. Then set:

```
NEXT_PUBLIC_JITSI_HOST=jitsi.your-domain.com
```

And update `components/torah/JitsiRoom.tsx` to use that host instead of `meet.jit.si`.

---

## Roadmap

- [ ] Rabbi payment / donation system (Stripe)
- [ ] Scheduled sessions (calendar view)
- [ ] Admin moderation dashboard
- [ ] Push notifications for matches & messages
- [ ] Self-hosted Jitsi integration
- [ ] Mobile app (React Native / Expo)
- [ ] Email digest for new matches
