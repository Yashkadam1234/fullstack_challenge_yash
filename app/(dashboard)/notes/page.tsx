import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase";

export default async function NotesPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", session.user.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between mb-4">
        <input
          placeholder="Search notes..."
          className="border px-2 py-1 w-full max-w-sm"
        />

        <Link
          href="/notes/new"
          className="ml-2 px-3 py-1 border"
        >
          New Note
        </Link>
      </div>

      {!notes?.length ? (
        <p>No notes yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {notes.map((n: any) => (
            <Link
              key={n.id}
              href={`/notes/${n.id}`}
              className="border p-3 rounded"
            >
              <h2 className="font-bold">{n.title}</h2>
              <p className="text-sm text-gray-600">
                {n.content?.slice(0, 100)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}