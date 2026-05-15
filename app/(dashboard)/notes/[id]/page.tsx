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
          id,
          name,
          color
        )
      )
    `
    )
    .eq("id", params.id)
    .eq("user_id", session.user.id)
    .single();

  if (!note) return notFound();

  const formatted = {
    id: note.id,
    title: note.title,
    content: note.content,
    tags: note.note_tags?.map((t: { tags: { id: string; name: string; color: string | null } }) => t.tags) || [],
    category_id: note.category_id,
    is_archived: note.is_archived,
    is_public: note.is_public,
    share_id: note.share_id,
    ai_summary: note.ai_summary,
    ai_action_items: note.ai_action_items,
    suggested_title: note.suggested_title,
  };

  return <NoteEditor note={formatted} />;
}