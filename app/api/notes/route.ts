import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { nanoid } from "nanoid";

/* =========================
   TYPES
========================= */
type NoteTag = {
  tag_id: string;
};

type NoteWithTags = {
  note_tags?: NoteTag[];
};

/* =========================
   GET NOTES
========================= */
export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const tag = searchParams.get("tag");
  const category = searchParams.get("category");
  const archived = searchParams.get("archived");
  const search = searchParams.get("search");
  const limit = Number(searchParams.get("limit") ?? 20);
  const offset = Number(searchParams.get("offset") ?? 0);

  let query = supabase
    .from("notes")
    .select(`
      *,
      note_tags (
        tag_id,
        tags (
          id,
          name,
          color
        )
      )
    `)
    .eq("user_id", session.user.id)
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (archived !== null) {
    query = query.eq("is_archived", archived === "true");
  }

  if (category) {
    query = query.eq("category_id", category);
  }

  if (search) {
    query = query.or(
      `title.ilike.%${search}%,content.ilike.%${search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let notes = (data ?? []) as NoteWithTags[];

  if (tag) {
    notes = notes.filter((note) =>
      note.note_tags?.some((nt) => nt.tag_id === tag)
    );
  }

  return NextResponse.json({ data: notes });
}

/* =========================
   CREATE NOTE
========================= */
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content, category_id } = body;

  if (!title || title.trim().length === 0) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  const shareId = nanoid(10);

  const { data, error } = await supabase
    .from("notes")
    .insert({
      title,
      content: content ?? "",
      user_id: session.user.id,
      category_id: category_id ?? null,
      is_public: false,
      is_archived: false,
      share_id: shareId,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}