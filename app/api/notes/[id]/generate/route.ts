import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import { generateNoteAI } from "@/lib/gemini";
import type { AIGenerationResult } from "@/types";
import { LRUCache } from "lru-cache";

const rateLimit = new LRUCache<string, number>({
  max: 500,
  ttl: 1000 * 60 * 60,
});

function checkRateLimit(userId: string) {
  const current = rateLimit.get(userId) || 0;

  if (current >= 10) return false;

  rateLimit.set(userId, current + 1);
  return true;
}

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

  if (!checkRateLimit(userId)) {
    return NextResponse.json(
      { error: "AI limit reached (10/hour)" },
      { status: 429 }
    );
  }

  const { data: note, error: fetchError } = await supabase
    .from("notes")
    .select("id, title, content")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (fetchError || !note) {
    return NextResponse.json(
      { error: "Note not found" },
      { status: 404 }
    );
  }

  let aiResult: AIGenerationResult;

  try {
    aiResult = await generateNoteAI(note.content, note.title);
  } catch {
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }

  const { data: updated, error: updateError } = await supabase
    .from("notes")
    .update({
      ai_summary: aiResult.summary,
      ai_action_items: aiResult.actionItems,
      suggested_title: aiResult.suggestedTitle,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data: aiResult,
    saved: updated,
  });
}