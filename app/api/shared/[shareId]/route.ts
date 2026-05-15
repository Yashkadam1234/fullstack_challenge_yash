import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

/* =========================
   GET PUBLIC NOTE
========================= */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  const { shareId } = await params;

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("notes")
    .select(
      `
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
    `
    )
    .eq("share_id", shareId)
    .eq("is_public", true)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  const publicNote = {
    id: data.id,
    title: data.title,
    content: data.content,
    created_at: data.created_at,
    updated_at: data.updated_at,
    tags: data.note_tags?.map((nt: any) => nt.tags) ?? [],
    share_id: data.share_id,
  };

  return NextResponse.json({ data: publicNote });
}