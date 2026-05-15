import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase";
import NoteEditor from "@/components/NoteEditor";

export default async function NotePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return notFound();

  const { data: note } = await supabase
    .from("notes")
    .select(
      `
      *,
      note_tags (
        tags (
          name
        )
      )
    `
    )
    .eq("id", params.id)
    .eq("user_id", session.user.id)
    .single();

  if (!note) return notFound();

  const formatted = {
    ...note,
    tags: note.note_tags?.map((t: any) => t.tags) || [],
  };

  return <NoteEditor note={formatted} />;
}