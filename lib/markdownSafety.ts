import { sanitiseMarkdown } from "@/lib/sanitise";

/**
 * Final safety pass after sanitiseMarkdown.
 *
 * Fixes any remaining invalid or empty code fence languages
 * that could crash MDXEditor.
 *
 * Converts:
 *   ```
 *   ```N/A
 *   ```undefined
 *   ```null
 *   ```unknown
 *   ```none
 *   ```<symbols>
 *
 * Into:
 *   ```txt
 */
export function nuclearFallback(md: string): string {
  return md.replace(
    /^(`{3,})(n\/a|na|undefined|null|unknown|none|[^a-z0-9\-_.\n]*)?(\n)/gim,
    (_, fenceChars: string, _badLang: string, newline: string) =>
      `${fenceChars}txt${newline}`
  );
}

/**
 * Complete markdown safety pipeline.
 * Always use this before returning AI markdown to clients.
 */
export function safeMarkdown(md: string): string {
  const pass1 = sanitiseMarkdown(md);
  return nuclearFallback(pass1);
}
