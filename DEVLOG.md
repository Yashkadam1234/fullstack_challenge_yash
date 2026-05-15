## Day 1 — 2026-05-14

**Hours worked:** 4

**What I did:**
Set up the Peblo Notes foundation with Next.js 16, TypeScript strict mode, and Tailwind. Structured the initial project architecture including App Router layout, API folder design, and component separation. Set up Supabase integration with SSR client handling using `@supabase/ssr`, created the database schema with RLS policies, and implemented authentication flow (login/signup + session handling). Added protected route logic through server-side session checks and initialized sample notes structure for testing relational queries (notes + tags via join tables).

**What worked well:**
Supabase RLS worked effectively for isolating user data without needing complex backend logic. The decision to use relational tagging (notes ↔ note_tags ↔ tags) made the data model flexible and scalable from the start.

**What I learned:**
Gained deeper understanding of Supabase SSR authentication flow and how it differs from client-only auth. Learned that Next.js App Router enforces stricter server/client boundaries, especially when handling cookies and sessions. Also understood why normalized tagging systems are better than embedding arrays directly in notes.

**Blockers / challenges:**
Initial friction with Supabase auth setup while switching to `@supabase/ssr`. Middleware vs App Router protection required rethinking the auth flow. Some confusion around cookie handling and server client initialization in Next.js 16.

**Plan for tomorrow:**
Start building the dashboard UI, implement full notes CRUD API layer, and design the AI integration pipeline (Gemini-powered note generation + summarization).

## Day 2 — 2026-05-15

**Hours worked:** 5

**What I did:**
Built the core backend APIs for notes including CRUD operations, AI generation with Gemini 2.5 Flash, and public sharing support. Then built the main UI layer with NoteEditor and notes dashboard with search and filters. Integrated Supabase SSR authentication across server routes and ensured all note operations are user-scoped.

**What worked well:**
AI integration worked smoothly once the generation pipeline and rate limiting were added. Supabase relational queries for tags worked well and kept data modeling clean. The NoteEditor auto-save flow felt responsive and stable after debounce tuning.

**What broke / challenges:**
Next.js 16 introduced strict changes in App Router dynamic route params, which caused multiple TypeScript errors across API routes. Supabase SSR cookie handling also required correction for proper server client initialization. Additionally, strict ESLint rules exposed unsafe `any` usage in nested query mappings.

**What I learned:**
Next.js App Router now enforces stricter typing for route handlers, especially around `params`. I also learned how fragile full-stack type safety can be when dealing with nested relational data from Supabase. Fixing CI issues required thinking in terms of both runtime correctness and type correctness simultaneously.

**Next step:**
Improve UI polish and UX feedback, add better loading states and skeletons, and enhance AI output integration inside the editor. Also plan to move rate limiting from in-memory storage to a persistent database solution for production readiness.