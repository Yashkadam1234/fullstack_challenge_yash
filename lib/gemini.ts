// lib/gemini.ts

import type { AIGenerationResult } from "@/types";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const FULL_PROMPT = `
You are an AI assistant that generates structured note insights.

You MUST respond ONLY in valid JSON.

No markdown.
No explanations.
No extra text.

Return this exact shape:

{
  "summary": "string (max 100 words)",
  "actionItems": ["string", "string"],
  "suggestedTitle": "string (max 5 words)"
}

Rules:
- summary must be concise and meaningful
- actionItems must be extracted as actionable tasks
- suggestedTitle must be short (max 5 words)
- If no tasks exist, return an empty array
- Output MUST be valid JSON only
`;

function fallbackParser(content: string): AIGenerationResult {
  const lines = content.split("\n").map((l) => l.trim());

  const summary =
    content.split(".")[0]?.slice(0, 500) ?? "No summary available";

  const actionItems = lines
    .filter((l) => l.startsWith("-") || l.startsWith("*"))
    .map((l) => l.replace(/^[-*]\s*/, "").trim())
    .slice(0, 10);

  const suggestedTitle =
    content.split(" ").slice(0, 5).join(" ") || "Untitled Note";

  return {
    summary,
    actionItems,
    suggestedTitle,
    generatedAt: new Date().toISOString(),
  };
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateNoteAI(
  content: string,
  title: string
): Promise<AIGenerationResult> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(`
${FULL_PROMPT}

TITLE: ${title}

CONTENT:
${content}

Return ONLY valid JSON.
`);

    const response = await result.response;
    const text = response.text();

    if (!text) {
      return fallbackParser(content);
    }

    let parsed: AIGenerationResult;

    try {
      parsed = JSON.parse(text);
    } catch {
      return fallbackParser(content);
    }

    return {
      summary: parsed.summary ?? fallbackParser(content).summary,
      actionItems: parsed.actionItems ?? [],
      suggestedTitle:
        parsed.suggestedTitle ??
        fallbackParser(content).suggestedTitle,
      generatedAt: new Date().toISOString(),
    };
  } catch {
    return fallbackParser(content);
  }
}