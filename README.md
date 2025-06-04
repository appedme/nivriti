# 🪷 Nivriti - A Calm Storytelling Platform

Nivriti is a peaceful storytelling platform designed to help users share their stories, connect through written experiences, and find calm through reading and writing.

## ✨ Core Features

### 🔐 Authentication

- Sign up / Sign in (Email or Google)
- Basic onboarding: choose username, bio, and genre preference

### 📝 Writing

- Create a new story (Title, Content, Tags)
- Edit & update your own stories
- Save drafts
- Story cover (auto-generated or optional upload)

### 📚 Reading

- View public stories by others (clean reader view)
- Filter by tags or genre (e.g., Romance, Fiction, Diary, Healing)
- Search stories by title or author

### 📣 Sharing

- Share story via public link
- Copy quote/snippet button
- Open Graph preview for social platforms

### 👤 Profile

- View user profile: name, photo, bio, list of stories written
- Link to social media (optional)

### 💬 Interaction

- Add comment to a story (basic comment box)
- Like / react to a story (e.g., "❤️ Felt this")

### 🧺 Create List (Reading Lists)

- Save stories to custom lists like "Favorites," "To Read," "Healing" etc.
- Public or private toggle on lists

## 💭 Tech Stack

- **Frontend:** Next.js 15 + Tailwind CSS
- **Backend:** Next.js API routes
- **State Management:** React Query or SWR
- **Auth:** AuthJS
- **Database:** Cloudflare D1
- **File Storage:** Cloudflare R2
- **Deployment:** Cloudflare Workers
- **Hosting:** Cloudflare Pages
- **Analytics:** Cloudflare Analytics

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ Development

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a font family from Vercel.

## 🔮 Future Features (Post-MVP)

- Audio narration
- AI insights / mood tagging
- Writing focus mode
- Journals / private stories
- Community circles
- Monetization
- Offline mode
- Reading with sound
- Story analytics

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
