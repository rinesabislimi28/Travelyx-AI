# Travelyx-AI

Travelyx-AI is an AI-powered travel planning app that generates detailed itineraries, estimates trip costs, and saves user trips with Supabase.

## Live Demo

[View the live demo](https://travelyx-ai.vercel.app)

## Tech Stack

- Next.js App Router
- React
- Supabase PostgreSQL and Auth
- Groq API with Llama models
- Vercel

## Local Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Documentation

Full project documentation is in [docs/project-overview.md](docs/project-overview.md).
