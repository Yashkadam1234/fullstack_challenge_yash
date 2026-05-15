import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

type Tag = {
  id: string;
  name: string;
  color: string | null;
};

type RawNoteTag = {
  tags: Tag | Tag[] | null;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const { shareId } = await params;

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("notes")
    .select(`
      id,
      title,
      content,
      created_at,
      updated_at,
      is_public,
      share_id,
      note_tags (
        tags (
          id,
          name,
          color
        )
      )
    `)
    .eq("share_id", shareId)
    .eq("is_public", true)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const rawTags = (data.note_tags ?? []) as RawNoteTag[];

  const tags: Tag[] = rawTags
    .flatMap((nt) => nt.tags)
    .filter(Boolean)
    .map((t) => {
      // ensure it's not array form
      if (Array.isArray(t)) return t[0];
      return t;
    });

  return NextResponse.json({
    data: {
      id: data.id,
      title: data.title,
      content: data.content,
      created_at: data.created_at,
      updated_at: data.updated_at,
      is_public: data.is_public,
      share_id: data.share_id,
      tags,
    },
  });
}