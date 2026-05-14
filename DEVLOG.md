Hours worked: 4

What I did: Set up the Peblo Notes foundation with Next.js 14, TypeScript strict mode, Tailwind, and shadcn/ui. Added core TypeScript interfaces, created the Supabase database schema with RLS policies, built login/signup auth pages, added protected routes middleware, and seeded the database with sample notes for testing.

What I learned: Spent time understanding Supabase RLS and how auth/session handling changes when using @supabase/ssr. Also realised a proper tags + note_tags relationship is much cleaner than storing tags directly in notes.

Blockers / what I'm stuck on: Had some setup friction while switching auth packages and making sure middleware + auth flow match the App Router setup.

Plan for tomorrow: Start building the dashboard, notes CRUD flow, and AI integration structure with Claude Haiku.