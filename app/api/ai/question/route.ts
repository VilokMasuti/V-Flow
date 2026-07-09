import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
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

const parseJsonResponse = (text: string) => {
  // Step 1 — strip markdown code fences if the AI wrapped the JSON anyway
  let cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  // Step 2 — extract just the JSON object, discard any text before/after
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  // Step 3 — try direct parse (happy path: AI followed instructions)
  try {
    return JSON.parse(cleaned);
  } catch {
    // Step 4 — AI put real newlines/tabs inside JSON string values
    // Walk through the string character by character to escape only
    // content that is inside a JSON string value, safely.
    let result = "";
    let inString = false;
    let escaped = false;

    for (let i = 0; i < cleaned.length; i++) {
      const ch = cleaned[i];

      if (escaped) {
        result += ch;
        escaped = false;
        continue;
      }

      if (ch === "\\") {
        result += ch;
        escaped = true;
        continue;
      }

      if (ch === '"') {
        inString = !inString;
        result += ch;
        continue;
      }

      if (inString) {
        // Escape control characters that break JSON parsing
        if (ch === "\n") {
          result += "\\n";
        } else if (ch === "\r") {
          result += "\\r";
        } else if (ch === "\t") {
          result += "\\t";
        } else {
          result += ch;
        }
      } else {
        result += ch;
      }
    }

    return JSON.parse(result);
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
   NEVER combine bold and setext like **Title**\\n=====.

CRITICAL JSON RULES — follow these exactly or the response will be rejected:
- Return ONLY a raw JSON object. Nothing before it. Nothing after it.
- Do NOT wrap the response in markdown code fences like \`\`\`json.
- Inside string values, write newlines as \\n — NEVER use real line breaks inside a JSON string.
- Inside string values, write tabs as \\t — NEVER use real tab characters inside a JSON string.
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

    const object = EnhancedQuestionSchema.parse(parseJsonResponse(text));

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
