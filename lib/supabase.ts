// lib/supabase.ts

import {
  createBrowserClient,
  createServerClient,
} from "@supabase/ssr";

import { cookies } from "next/headers";

// Replace this with generated Supabase types later
export type Database = {
  public: {
    Tables: Record<string, never>;
  };
};

/**
 * Browser client
 * Use in client components
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Server client
 * Use in server components / layouts / server actions
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}