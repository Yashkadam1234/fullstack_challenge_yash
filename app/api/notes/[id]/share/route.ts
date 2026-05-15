import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

/* =========================
   TOGGLE SHARE
========================= */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // GET CURRENT NOTE
  const { data: note, error: fetchError } = await supabase
    .from("notes")
    .select("id, is_public, share_id")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (fetchError || !note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  let updated;

  // TOGGLE LOGIC
  if (!note.is_public) {
    const { data, error } = await supabase
      .from("notes")
      .update({
        is_public: true,
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select("is_public, share_id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    updated = data;
  } else {
    const { data, error } = await supabase
      .from("notes")
      .update({
        is_public: false,
        share_id: null,
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select("is_public, share_id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    updated = data;
  }

  return NextResponse.json({ data: updated });
}