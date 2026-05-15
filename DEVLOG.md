Hours worked: 4

What I did: Set up the Peblo Notes foundation with Next.js 14, TypeScript strict mode, Tailwind, and shadcn/ui. Added core TypeScript interfaces, created the Supabase database schema with RLS policies, built login/signup auth pages, added protected routes middleware, and seeded the database with sample notes for testing.

What I learned: Spent time understanding Supabase RLS and how auth/session handling changes when using @supabase/ssr. Also realised a proper tags + note_tags relationship is much cleaner than storing tags directly in notes.

Blockers / what I'm stuck on: Had some setup friction while switching auth packages and making sure middleware + auth flow match the App Router setup.

Plan for tomorrow: Start building the dashboard, notes CRUD flow, and AI integration structure with Claude Haiku.

## Day 2 — 2026-05-15

**Hours worked:** 5

**What I did:**
Built the core backend APIs for notes including CRUD operations, AI generation with Gemini 2.5 Flash, and public sharing support. Then built the main UI layer with NoteEditor and notes dashboard with search and filters.

**What worked well:**
AI integration was smoother than expected once fallback logic was added. Supabase RLS made data isolation clean without extra code.

**What broke / challenges:**
Next.js 16 route handler typing changes caused multiple TS errors with params handling. Supabase SSR cookies also required adjustments.

**What I learned:**
App Router is strict with async params now. Also learned how important it is to design API + UI together because the NoteEditor flow depends heavily on backend structure.

**Next step:**
Improve UI polish, add loading states, and connect AI output directly into editor preview with better UX feedback.