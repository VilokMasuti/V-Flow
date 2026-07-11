import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { jsonrepair } from "jsonrepair";
import { NextResponse } from "next/server";
import { z } from "zod";

import { safeMarkdown } from "@/lib/markdownSafety";

const EnhancedQuestionSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(1),
  tags: z.array(z.string().min(1).max(30)).min(1).max(3),
});

const cleanTags = (tags: string[]) =>
  [
    ...new Set(
      tags
        .map((tag) => tag.trim().toLowerCase().replace(/^#+/, ""))
        .filter(Boolean)
    ),
  ].slice(0, 3);

const parseJsonResponse = (raw: string): unknown => {
  let text = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    text = text.slice(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(text);
  } catch {
    try {
      return JSON.parse(jsonrepair(text));
    } catch (repairError) {
      console.error("jsonrepair failed:", repairError);
      console.error("Raw AI output:", raw);
      throw new Error("Could not parse AI response as JSON");
    }
  }
};

export async function POST(req: Request) {
  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json(
      { success: false, error: "Title and content are required" },
      { status: 400 }
    );
  }

  try {
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),

      system: `You are a senior software engineer improving developer questions.

Return valid raw JSON only.
No markdown fences.
No explanation.

All code fences MUST include a language:
\`\`\`js \`\`\`ts \`\`\`bash \`\`\`txt

Never write bare \`\`\`
Never use N/A, undefined, null as a language.`,

      prompt: `
Rewrite this developer question clearly and professionally.

Title: "${title}"
Content: "${content}"

Requirements:
- Improve clarity
- Keep original intent
- Use ATX headings only (# ## ###)
- Never use setext headings (=== or ---)
- Never use bold text as headings
- Always include language in code fences
- Generate 1–3 lowercase tags

Return EXACTLY this JSON shape:

{
  "title": "clear question title",
  "content": "markdown with \\n line breaks",
  "tags": ["tag-one", "tag-two"]
}
`,
    });

    const parsed = parseJsonResponse(text);
    const object = EnhancedQuestionSchema.parse(parsed);

    const safeContent = safeMarkdown(object.content.trim());

    return NextResponse.json({
      success: true,
      data: {
        title: object.title.trim(),
        content: safeContent,
        tags: cleanTags(object.tags),
      },
    });
  } catch (error) {
    console.error("Enhance error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to enhance question" },
      { status: 500 }
    );
  }
}
