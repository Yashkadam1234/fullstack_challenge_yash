import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

import { createServerSupabaseClient } from "@/lib/supabase";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Peblo Notes — AI-powered workspace",
  description:
    "Collaborative AI-powered notes workspace for productivity and learning.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.className} min-h-screen bg-background text-foreground antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}