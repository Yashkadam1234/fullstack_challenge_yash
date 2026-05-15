"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Tag = {
  id?: string;
  name: string;
};

type AIResult = {
  summary: string;
  actionItems: string[];
  suggestedTitle: string;
};

type Note = {
  id: string;
  title: string;
  content: string;
  tags: Tag[];
  category_id?: string | null;
  is_archived: boolean;
  is_public: boolean;
  share_id?: string | null;
  ai_summary?: string | null;
  ai_action_items?: string[] | null;
  suggested_title?: string | null;
};

export default function NoteEditor({ note }: { note: Note }) {
  const router = useRouter();

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<Tag[]>(note.tags || []);
  const [tagInput, setTagInput] = useState("");

  const [saving, setSaving] = useState(false);
  const [ai, setAi] = useState<AIResult | null>(null);

  const [isPublic, setIsPublic] = useState(note.is_public);

  /* =========================
     AUTO SAVE (debounced)
  ========================= */
  useEffect(() => {
    const timeout = setTimeout(async () => {
      setSaving(true);

      await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      setSaving(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, [title, content]);

  /* =========================
     TAGS
  ========================= */
  const addTag = async (tag: string) => {
    if (!tag.trim()) return;

    const newTags = [...tags, { name: tag }];
    setTags(newTags);
    setTagInput("");

    await fetch(`/api/notes/${note.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tags: newTags }),
    });
  };

  /* =========================
     AI GENERATION
  ========================= */
  const generateAI = async () => {
    const res = await fetch(`/api/notes/${note.id}/generate`, {
      method: "POST",
    });

    const data = await res.json();
    setAi(data.data);
  };

  /* =========================
     ARCHIVE
  ========================= */
  const archiveNote = async () => {
    await fetch(`/api/notes/${note.id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_archived: true }),
    });

    router.push("/notes");
  };

  /* =========================
     SHARE
  ========================= */
  const toggleShare = async () => {
    const res = await fetch(`/api/notes/${note.id}/share`, {
      method: "POST",
    });

    const data = await res.json();
    setIsPublic(data.data.is_public);

    if (data.data.share_id) {
      navigator.clipboard.writeText(
        `${window.location.origin}/shared/${data.data.share_id}`
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      {/* TITLE */}
      <input
        className="w-full text-3xl font-bold outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title..."
      />

      {/* SAVE STATUS */}
      <p className="text-sm text-gray-500">
        {saving ? "Saving..." : "Saved ✓"}
      </p>

      {/* CONTENT */}
      <textarea
        className="w-full min-h-[200px] p-2 border rounded resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note..."
      />

      {/* TAG INPUT */}
      <div className="flex gap-2 flex-wrap">
        {tags.map((t, i) => (
          <span key={i} className="px-2 py-1 bg-gray-200 rounded">
            {t.name}
          </span>
        ))}

        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTag(tagInput);
            }
          }}
          placeholder="Add tag..."
          className="border px-2 py-1"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={generateAI} className="px-3 py-1 border">
          Generate AI Summary
        </button>

        <button onClick={archiveNote} className="px-3 py-1 border">
          Archive
        </button>

        <button onClick={toggleShare} className="px-3 py-1 border">
          Share
        </button>
      </div>

      {/* AI RESULT */}
      {ai && (
        <div className="p-3 border rounded space-y-2">
          <p className="font-semibold">Summary</p>
          <p>{ai.summary}</p>

          <p className="font-semibold">Action Items</p>
          <ul className="list-disc ml-5">
            {ai.actionItems.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>

          <p className="font-semibold">Suggested Title</p>
          <div className="flex gap-2 items-center">
            <span>{ai.suggestedTitle}</span>
            <button onClick={() => setTitle(ai.suggestedTitle)}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}