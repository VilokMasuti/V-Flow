import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import logger from "@/lib/logger";
import { sanitiseMarkdown } from "@/lib/sanitise";
import { AIAnswerSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const { question, content, userAnswer } = await req.json();

  try {
    const validatedData = AIAnswerSchema.safeParse({ question, content });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `Generate a markdown-formatted response to the following question: "${question}".

      Consider the provided context:
      **Context:** ${content}

      Also, prioritize and incorporate the user's answer when formulating your response:
      **User's Answer:** ${userAnswer}

      Prioritize the user's answer only if it's correct. If it's incomplete or incorrect, improve or correct it while keeping the response concise and to the point.
      Provide the final answer in markdown format.`,
      system: `You are a helpful assistant that provides informative responses in markdown format.

HEADING RULES — follow exactly:
- Use ONLY ATX-style headings: # H1  ## H2  ### H3
- NEVER use setext-style headings (underlined with === or ---).
- NEVER write **Bold Text** as a heading. Use # ## ### only.
- NEVER combine bold and setext like **Title**\n=====

CODE BLOCK RULES — follow exactly:
- ALWAYS put a language on every code fence.
- Use short lowercase identifiers: js, ts, py, html, css, bash, sql etc.
- NEVER write a bare \`\`\` with no language.
- NEVER use N/A, undefined, null, or unknown as a language name.
- If you do not know the language, write \`\`\`txt

Return clean markdown only. No JSON. No explanations outside the answer.`,
    });

    const sanitised = sanitiseMarkdown(text);

    return NextResponse.json({ success: true, data: sanitised }, { status: 200 });
  } catch (error) {
    logger.error({ err: error }, "Failed to generate AI answer");
    return handleError(error, "api") as APIErrorResponse;
  }
}
