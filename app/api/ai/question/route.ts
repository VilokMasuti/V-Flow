import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

const EnhancedQuestionSchema = z.object({
  title: z.string().min(5).max(100).describe("A clear, specific question title under 100 characters."),
  content: z
    .string()
    .min(1)
    .describe("The improved question body in Markdown. Do not repeat the title as an H1 heading."),
  tags: z
    .array(z.string().min(1).max(30).describe("A short lowercase technology or topic tag without #."))
    .min(1)
    .max(3)
    .describe("One to three relevant tags."),
});

const cleanTags = (tags: string[]) =>
  [...new Set(tags.map((tag) => tag.trim().toLowerCase().replace(/^#+/, "")).filter(Boolean))].slice(0, 3);

const parseJsonResponse = (text: string) => {
  const jsonText = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  return JSON.parse(jsonText);
};

export async function POST(req: Request) {
  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json({ success: false, error: "Title and content are required" }, { status: 400 });
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
7. Generate 1 to 3 short lowercase tags such as "javascript", "java", "react", or "node.js".
8. Make it detailed enough that developers can actually help.

Return ONLY valid JSON in this exact shape:
{
  "title": "clear question title",
  "content": "markdown question body",
  "tags": ["tag-one", "tag-two"]
}

Do not wrap the JSON in markdown fences. Do not add explanation or preamble.
`,
      system:
        "You are a technical writing expert. Improve developer questions while preserving the user's original intent. Return valid JSON only.",
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
    return NextResponse.json({ success: false, error: "Failed to enhance question" }, { status: 500 });
  }
}
