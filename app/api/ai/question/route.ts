import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { jsonrepair } from "jsonrepair";
import { NextResponse } from "next/server";
import { z } from "zod";

const EnhancedQuestionSchema = z.object({
  title: z
    .string()
    .min(5)
    .max(100)
    .describe("A clear, specific question title under 100 characters."),
  content: z
    .string()
    .min(1)
    .describe(
      "The improved question body in Markdown. Do not repeat the title as an H1 heading."
    ),
  tags: z
    .array(
      z
        .string()
        .min(1)
        .max(30)
        .describe("A short lowercase technology or topic tag without #.")
    )
    .min(1)
    .max(3)
    .describe("One to three relevant tags."),
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
  // Step 1 — strip markdown code fences the AI wraps around JSON
  let text = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Step 2 — extract the outermost { ... } object
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    text = text.slice(firstBrace, lastBrace + 1);
  }

  // Step 3 — attempt clean parse first (fast path)
  try {
    return JSON.parse(text);
  } catch {
    // Step 4 — hand off to jsonrepair which handles:
    //   • real newlines / tabs inside string values
    //   • unescaped double-quotes inside string values
    //   • trailing commas
    //   • single-quoted strings
    //   • missing closing braces
    //   • and ~40 other malformed patterns
    try {
      return JSON.parse(jsonrepair(text));
    } catch (repairError) {
      console.error("jsonrepair also failed:", repairError);
      console.error("Raw AI output was:\n", raw);
      throw new Error("Could not parse AI response as JSON even after repair");
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
      prompt: `
You are a developer community expert helping improve question quality.

The user wrote this question:
Title: "${title}"
Content: "${content}"

Your job:
1. Rewrite the title so it is clear, specific, and under 100 characters.
2. Rewrite the content in clear, well-structured Markdown.
3. Do not include the title as a top-level Markdown heading inside the content.
4. Add missing details, examples, or context when helpful.
5. Keep the user's original intent; do not change what they are asking.
6. Add relevant code blocks if needed.
7. Generate 1 to 3 short lowercase tags such as "javascript", "react", or "node.js".
8. Make it detailed enough that developers can actually help.
9. Use ONLY ATX-style headings: # H1  ## H2  ### H3
   NEVER use setext-style headings (text underlined with === or ---).
   NEVER bold a heading like **My Heading**.

CRITICAL JSON RULES — follow these exactly or the response will be rejected:
- Return ONLY a raw JSON object. Nothing before it. Nothing after it.
- Do NOT wrap the response in markdown code fences like \`\`\`json.
- Inside string values, write newlines as \\n — NEVER use real line breaks inside a JSON string.
- Inside string values, write tabs as \\t — NEVER use real tab characters inside a JSON string.
- Inside string values, NEVER use unescaped double quotes. Use \\" for any quote character.
- The entire response must be parseable by JSON.parse() with zero pre-processing.

Return this exact shape:
{
  "title": "clear question title",
  "content": "markdown body with \\n for line breaks",
  "tags": ["tag-one", "tag-two"]
}
`,
      system:
        "You are a technical writing expert. Improve developer questions while preserving the user's original intent. Return valid raw JSON only — no markdown, no explanation, no code fences.",
    });

    const parsed = parseJsonResponse(text);
    const object = EnhancedQuestionSchema.parse(parsed);

    return NextResponse.json({
      success: true,
      data: {
        title: object.title.trim(),
        content: object.content.trim(),
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
