import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

function sanitiseMarkdown(raw: string): string {
  // ── Step 1: Extract fenced code blocks to protect them from all transforms ──
  const codeBlocks: string[] = [];
  let out = raw.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `%%CB_${codeBlocks.length - 1}%%`;
  });

  // ── Step 2: Fix setext headings line-by-line (regex multiline is unreliable) ──
  const lines = out.split("\n");
  const fixed: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const curr = lines[i];
    const next = lines[i + 1] ?? "";

    if (/^=+\s*$/.test(next)) {
      // setext h1 — also strip surrounding **bold** markers the AI loves to add
      fixed.push("# " + curr.replace(/^\*\*|\*\*$/g, "").trim());
      i++; // skip the === line
    } else if (/^-{3,}\s*$/.test(next) && curr.trim().length > 0) {
      // setext h2 — only convert if the line above is non-empty text
      fixed.push("## " + curr.replace(/^\*\*|\*\*$/g, "").trim());
      i++; // skip the --- line
    } else {
      fixed.push(curr);
    }
  }

  out = fixed.join("\n");

  // ── Step 3: All other sanitisation ──
  out = out
    // encoding artifacts
    .replace(/&#x20;/g, "")
    .replace(/&nbsp;/g, " ")

    // self-closing HTML tags MDX chokes on
    .replace(/<br\s*\/?>/gi, "\n\n")
    .replace(/<hr\s*\/?>/gi, "\n\n---\n\n")
    .replace(/<img[^>]*\/?>/gi, "")

    // HTML comments
    .replace(/<!--[\s\S]*?-->/g, "")

    // bare URLs — wrap in <> so MDX doesn't parse as JSX
    // but do NOT touch URLs already inside []() markdown links
    .replace(
      /(?<!\]\(|href="|href=')(https?:\/\/[^\s)\]"'<>]+)(?!\))/g,
      "<$1>"
    )

    // stray < > that aren't real HTML tags or angle-bracket URLs
    .replace(/(?<![`\w])<(?![a-zA-Z\/!])/g, "&lt;")
    .replace(/(?<![`\w])>(?![a-zA-Z\/\s])/g, "&gt;")

    // collapse 3+ blank lines
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // ── Step 4: Restore code blocks, adding "txt" if no language was given ──
  out = out.replace(/%%CB_(\d+)%%/g, (_, i) => {
    const block = codeBlocks[Number(i)];
    // ``` with nothing or only spaces after it → ```txt
    return block.replace(/^```[ \t]*\n/, "```txt\n");
  });

  return out;
}

export const Preview = ({ content }: { content: string }) => {
  const formattedContent = sanitiseMarkdown(content);

  return (
    <section className="markdown prose grid w-full min-w-0 max-w-full break-words">
      <MDXRemote
        source={formattedContent}
        options={{
          mdxOptions: {
            format: "md",
          },
        }}
        components={{
          pre: ({ children }) => {
            const codeEl = children as React.ReactElement<{
              className?: string;
              children?: string;
            }>;

            const className = codeEl?.props?.className ?? "";
            const rawLang = className.replace("language-", "").trim();

            // bright throws on "", "N/A", "undefined", or any unrecognised value
            const lang =
              rawLang &&
              rawLang !== "N/A" &&
              rawLang !== "undefined" &&
              rawLang !== "null"
                ? rawLang
                : "txt";

            const codeStr = String(codeEl?.props?.children ?? "").replace(
              /\n$/,
              ""
            );

            return (
              <Code
                lang={lang}
                lineNumbers
                className="!bg-[#111] !border !border-[#252525] !rounded-xl !my-4 text-neutral-50"
              >
                {codeStr}
              </Code>
            );
          },

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-500 border-b border-primary-500/30 hover:border-primary-500/60 transition-colors"
            >
              {children}
            </a>
          ),
        }}
      />
    </section>
  );
};
