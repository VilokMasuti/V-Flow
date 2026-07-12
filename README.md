<p align="center">
  <img src="./public/logo.png" alt="DevFlow Logo" width="180" />
</p>

<h1 align="center">DevFlow</h1>

<p align="center">
  <strong>A full-stack developer community platform inspired by Stack Overflow, enhanced with AI-powered workflows, gamification, and modern Next.js architecture.</strong>
</p>

<p align="center">
  Ask questions, post answers, discover developers, explore tags, save collections, get AI help, and grow with a community-first experience.
</p>

<p align="center">
  <a href="https://v-flow-alpha.vercel.app/"><img src="https://img.shields.io/badge/Live-Demo-orange?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Made%20with-Next.js-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
</p>

---

## Badges

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Auth.js-000000?style=flat-square&logo=auth0&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/ShadCN_UI-111111?style=flat-square" />
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=flat-square" />
  <img src="https://img.shields.io/badge/AI-Groq%20%7C%20OpenAI-orange?style=flat-square" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel" />
</p>

---

## Overview

**DevFlow** is a production-style, full-stack Q&A platform for developers.

Built with the latest **Next.js App Router** patterns, it combines classic developer community features with modern enhancements like:

- **AI-generated answers**
- **AI-enhanced question writing**
- **rich markdown support**
- **gamification and badges**
- **recommendations**
- **collections and bookmarks**
- **global search**
- **developer profiles**
- **job discovery**

This project also explores advanced rendering and performance strategies including:

- **SSG**
- **ISR**
- **SSR**
- **PPR**
- **server functions**
- **caching**
- **revalidation**

---

## Live Demo

 **Production URL:**
[https://v-flow-alpha.vercel.app/](https://v-flow-alpha.vercel.app/)

---

## Screenshots

> Add your screenshots into `public/screenshots/` with these names for the images below to work.

### Home Page
<p align="center">
  <img src="./public/screenshots/home.png" alt="Home Page" width="100%" />
</p>

### Question Details
<p align="center">
  <img src="./public/screenshots/question-details.png" alt="Question Details" width="100%" />
</p>

### Ask Question
<p align="center">
  <img src="./public/screenshots/ask-question.png" alt="Ask Question" width="100%" />
</p>

### User Profile
<p align="center">
  <img src="./public/screenshots/profile.png" alt="Profile Page" width="100%" />
</p>

### Collections / Saved Questions
<p align="center">
  <img src="./public/screenshots/collections.png" alt="Collections Page" width="100%" />
</p>

---

## Feature Highlights

<table>
  <tr>
    <td width="33%">
      <h3> AI Assistance</h3>
      <p>Generate answers with AI and enhance user questions into cleaner, more detailed, better-structured posts.</p>
    </td>
    <td width="33%">
      <h3> Smart Developer Experience</h3>
      <p>Rich markdown support, code blocks, pagination, filtering, sorting, and clean interaction flows across the platform.</p>
    </td>
    <td width="33%">
      <h3> Gamification</h3>
      <p>Badges, reputation, engagement tracking, and community-driven interaction designed to reward meaningful participation.</p>
    </td>
  </tr>
  <tr>
    <td width="33%">
      <h3> Authentication</h3>
      <p>Secure login and user management with Auth.js / NextAuth using Email, Google, and GitHub providers.</p>
    </td>
    <td width="33%">
      <h3> Discovery</h3>
      <p>Explore tags, recommended content, popular questions, community members, and global search results.</p>
    </td>
    <td width="33%">
      <h3> Performance</h3>
      <p>Built with modern Next.js rendering strategies and production-ready architecture for fast, scalable experiences.</p>
    </td>
  </tr>
</table>

---

## Core Features

### Authentication
- Email / Password authentication
- Google OAuth
- GitHub OAuth
- Protected routes and session handling

### Questions & Answers
- Ask programming questions
- Post answers
- Edit and delete questions/answers
- Upvote and downvote content
- Rich markdown/MDX support
- Safe rendering for code blocks and formatted content

### AI Features
- AI answer generation
- AI question enhancement
- markdown sanitization for unstable AI output
- fallback handling for invalid code fences like `N/A`, `undefined`, or empty fences

### User Experience
- Home feed with filters, search, and pagination
- Answer sorting and filtering
- Bookmarking / collections
- User profiles with badges and activity
- View tracking
- Global search
- Recommendations
- Tags and tag detail pages
- Job search page
- Responsive design

---

## Tech Stack

### Frontend
- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **ShadCN UI**

### Backend / Data
- **MongoDB**
- **Mongoose**
- **Server Actions / Route Handlers**

### Validation / Forms
- **Zod**
- **React Hook Form**

### Authentication
- **NextAuth / Auth.js**

### AI
- **AI SDK**
- **Groq**
- **OpenAI-compatible workflows**

---

## Architecture Notes

This project focuses heavily on clean architecture and modern full-stack patterns:

- reusable UI components
- centralized route constants
- validation schemas
- server-first data fetching
- metadata and SEO support
- markdown sanitization pipeline
- scalable folder structure
- strong separation of concerns

---

## Folder Structure

```txt
.
├── app
│   ├── api
│   │   ├── ai
│   │   │   ├── answer
│   │   │   │   └── route.ts
│   │   │   └── enhance-question
│   │   │       └── route.ts
│   │   ├── auth
│   │   └── ...
│   ├── profile
│   │   └── [id]
│   │       └── page.tsx
│   ├── questions
│   ├── tags
│   ├── jobs
│   ├── collection
│   ├── community
│   ├── layout.tsx
│   └── globals.css
│
├── components
│   ├── cards
│   ├── lens
│   ├── ui
│   ├── user
│   └── ...
│
├── constants
│   ├── routes.ts
│   ├── states.ts
│   └── ...
│
├── lib
│   ├── actions
│   ├── handlers
│   ├── logger.ts
│   ├── markdownSafety.ts
│   ├── sanitise.ts
│   ├── validations.ts
│   └── ...
│
├── public
│   ├── logo.png
│   ├── og-image.png
│   ├── screenshots
│   │   ├── home.png
│   │   ├── question-details.png
│   │   ├── ask-question.png
│   │   ├── profile.png
│   │   └── collections.png
│   └── ...
│
├── auth.ts
├── middleware.ts
├── next.config.ts
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have installed:

- **Git**
- **Node.js**
- **npm**

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/JavaScript-Mastery-Pro/devflow-v2-record.git
cd devflow-v2-record
```

### 2. Install dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env.local` file in the root of the project:

```env
# Database
MONGODB_URI=

# AI
GROQ_API_KEY=
OPENAI_API_KEY=

# Rapid API
NEXT_PUBLIC_RAPID_API_KEY=

# Auth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_SECRET=

# App URLs
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Editor / integrations
NEXT_PUBLIC_TINY_EDITOR_API_KEY=

# Environment
NODE_ENV=development
```

Replace the placeholders with your own credentials.

---

## Run Locally

```bash
npm run dev
```

Then open:

```txt
http://localhost:3000
```

---

## Production Deployment

When deploying to **Vercel**, make sure production environment variables use your real domain instead of localhost:

```env
NEXTAUTH_URL=https://v-flow-alpha.vercel.app
NEXT_PUBLIC_SITE_URL=https://v-flow-alpha.vercel.app
NEXT_PUBLIC_API_BASE_URL=https://v-flow-alpha.vercel.app/api
```

This is required for:

- auth callbacks
- metadata
- Open Graph images
- social previews
- dynamic route previews

---

## SEO / Open Graph

For best link previews:

- keep your app logo in `public/logo.png`
- use a dedicated banner image in `public/og-image.png`
- recommended OG size: **1200 × 630**

This improves previews on:

- GitHub links
- Discord
- Twitter / X
- LinkedIn
- Facebook

---

## Why This Project Stands Out

- production-style full-stack architecture
- modern App Router implementation
- developer-focused community product
- strong reusability and scalability
- practical AI integration
- polished UI and performance-first thinking

---

## Roadmap

- dynamic Open Graph image generation
- notifications
- real-time updates
- better recommendation engine
- richer reputation system
- advanced moderation tools

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Commit and push
5. Open a pull request

---

## Support

If you get stuck, find a bug, or need help understanding the project, feel free to ask for support through your developer community or project discussion channels.

---

## License

This project is for learning, portfolio, and demonstration purposes unless a separate license is added.

---

## Author

Built with passion for developers, community, and modern full-stack engineering.

<p align="center">
  <img src="./public/logo.png" alt="DevFlow Footer Logo" width="120" />
</p>
