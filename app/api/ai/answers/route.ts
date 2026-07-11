import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { NextResponse } from "next/server";

import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import logger from "@/lib/logger";
import { sanitiseMarkdown } from "@/lib/sanitise";
import { AIAnswerSchema } from "@/lib/validations";

/**
 * Nuclear fallback: runs AFTER sanitiseMarkdown.
 *
 * If the model still somehow produced a bad language tag that slipped
 * through the regex in sanitise.ts, this catches it with a second pass
 * focused specifically on the crash pattern MDXEditor produces.
 *
 * The specific crash is: {"type":"code","name":"N/A"}
 * which means the fence language was literally "N/A" (or similar).
 */
function nuclearFallback(md: string): string {
  // Match any code fence where the language:
  //   - is empty
  //   - is N/A (any casing)
  //   - is undefined / null / unknown / none
  //   - contains a slash (N/A) or is purely non-alpha
  return md.replace(
    /^(`{3,})(n\/a|na|undefined|null|unknown|none|[^a-z0-9\-_.\n]*)?(\n)/gim,
    (_, fenceChars: string, _badLang: string, newline: string) =>
      `${fenceChars}txt${newline}`
  );
}

export async function POST(req: Request) {
  const { question, content, userAnswer } = await req.json();

  try {
    const validatedData = AIAnswerSchema.safeParse({ question, content });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),

      // The system prompt enforces the code block rule as the FIRST thing.
      // Small models (8b) follow system prompt instructions more reliably
      // when the most important rule is stated first and repeated.
      system: `You are a helpful technical assistant. You write answers in clean Markdown.

RULE 1 — CODE BLOCKS: Every code block MUST have a language tag.
  Write: \`\`\`js  or  \`\`\`py  or  \`\`\`bash  or  \`\`\`txt
  NEVER write a bare \`\`\` with nothing after it.
  NEVER write \`\`\`N/A or \`\`\`undefined or \`\`\`null or \`\`\`unknown.
  If you do not know the language, write \`\`\`txt

RULE 2 — HEADINGS: Use # ## ### only.
  NEVER use === or --- underlines for headings.
  NEVER use **Bold Text** as a heading.

RULE 3 — OUTPUT: Return clean Markdown only. No JSON. No explanation outside the answer.`,

      prompt: `Answer this question clearly and helpfully.

Question: "${question}"

Context from the question body:
${content}

${userAnswer ? `The user has also written this partial answer — incorporate it if correct, improve it if incomplete:
${userAnswer}` : ""}

Write your answer in Markdown. Remember: every code block needs a language tag like \`\`\`js or \`\`\`py or \`\`\`txt — never a bare \`\`\`.`,
    });

    // Pass 1: sanitiseMarkdown handles setext headings, bold headings,
    //         and all known bad language aliases via LANG_MAP
    const pass1 = sanitiseMarkdown(text);

    // Pass 2: nuclear fallback catches anything that slipped through
    const sanitised = nuclearFallback(pass1);

    return NextResponse.json({ success: true, data: sanitised }, { status: 200 });
  } catch (error) {
    logger.error({ err: error }, "Failed to generate AI answer");
    return handleError(error, "api") as APIErrorResponse;
  }
}
