// lib/sanitise.ts — UNIVERSAL, handles anything an LLM can produce

// ─── Master language map ────────────────────────────────────────────────────
// Maps EVERY possible variant an LLM might output → the short key your
// codeMirrorPlugin actually knows about.
const LANG_MAP: Record<string, string> = {
  // JavaScript
  javascript: "js", js: "js", node: "js", nodejs: "js", es6: "js",
  es2015: "js", es2020: "js", ecmascript: "js", mjs: "js", cjs: "js",

  // TypeScript
  typescript: "ts", ts: "ts",
  tsx: "tsx", "typescript(react)": "tsx", "typescript-react": "tsx",
  jsx: "jsx", "javascript(react)": "jsx", "javascript-react": "jsx",

  // Python
  python: "py", py: "py", python3: "py", python2: "py", py3: "py",

  // Shell
  bash: "bash", sh: "bash", shell: "bash", zsh: "bash",
  fish: "bash", powershell: "bash", ps1: "bash", cmd: "bash",
  bat: "bash", terminal: "bash", console: "bash", cli: "bash",

  // Web
  html: "html", htm: "html", xhtml: "html",
  css: "css", scss: "scss", sass: "scss", less: "css",
  svg: "html",

  // Data
  json: "json", jsonc: "json", json5: "json",
  yaml: "yaml", yml: "yaml",
  toml: "toml", ini: "toml", env: "txt", dotenv: "txt",
  xml: "xml",

  // DB
  sql: "sql", mysql: "sql", postgresql: "sql", postgres: "sql",
  sqlite: "sql", mssql: "sql", plsql: "sql",
  graphql: "graphql", gql: "graphql",

  // Systems
  c: "c", "c++": "cpp", cpp: "cpp", "c#": "cs", csharp: "cs", cs: "cs",
  rust: "rs", rs: "rs",
  go: "go", golang: "go",
  java: "java",
  kotlin: "kt", kt: "kt",
  swift: "swift",
  dart: "dart",
  scala: "scala",
  r: "r",
  lua: "lua",
  perl: "perl", pl: "perl",
  ruby: "rb", rb: "rb",
  php: "php",
  elixir: "elixir", ex: "elixir", exs: "elixir",
  erlang: "erlang", erl: "erlang",
  haskell: "haskell", hs: "haskell",
  ocaml: "ocaml", ml: "ocaml",
  clojure: "clojure", clj: "clojure",
  fsharp: "txt", "f#": "txt",
  nim: "txt",
  zig: "txt",

  // Mobile
  "objective-c": "txt", objc: "txt",

  // Config / Infra
  dockerfile: "txt", docker: "txt",
  makefile: "txt", make: "txt",
  cmake: "txt",
  nginx: "txt", apache: "txt",
  terraform: "txt", tf: "txt",
  ansible: "yaml",

  // Markup / Docs
  markdown: "txt", md: "txt", mdx: "txt",
  latex: "txt", tex: "txt",
  rst: "txt",

  // Misc
  http: "txt", diff: "txt", patch: "diff",
  prisma: "txt", regex: "txt", regexp: "txt",
  plaintext: "txt", plain: "txt", text: "txt",
  txt: "txt", none: "txt", unknown: "txt",
  output: "txt", result: "txt", example: "txt",
  code: "txt", snippet: "txt", sample: "txt",
};

// These are the ONLY langs your codeMirrorPlugin accepts
// (matches exactly what you have in editar.tsx)
const EDITOR_LANGS = new Set([
  "js", "ts", "tsx", "jsx",
  "py", "java", "c", "cpp", "cs", "go", "rs", "rb", "php",
  "swift", "kt", "dart", "scala", "r", "lua", "perl",
  "bash", "html", "css", "scss",
  "json", "yaml", "toml", "xml",
  "sql", "graphql",
  "diff", "txt", "",
]);

function normaliseLang(raw: string): string {
  if (!raw) return "txt";

  // clean: lowercase, strip spaces, special chars except + # . -
  const cleaned = raw
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9#+.\-]/g, "");

  if (!cleaned) return "txt";

  // strip leading dot (.js → js)
  const key = cleaned.startsWith(".") ? cleaned.slice(1) : cleaned;

  // explicit invalid values
  const INVALID = new Set([
    "n/a", "na", "null", "undefined", "none", "unknown",
    "unspecified", "language", "lang", "code", "snippet",
    "example", "sample", "output", "result", "",
  ]);
  if (INVALID.has(key)) return "txt";

  // map to known lang
  const mapped = LANG_MAP[key] ?? key;

  // if mapped lang is in editor's accepted set → use it
  if (EDITOR_LANGS.has(mapped)) return mapped;

  // last resort → txt (never crashes MDXEditor)
  return "txt";
}

export function sanitiseMarkdown(raw: string): string {
  if (!raw || typeof raw !== "string") return "";

  // ── 0. Normalise line endings ──────────────────────────────────────────
  let out = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // ── 1. EXTRACT code blocks FIRST (protect from all transforms) ─────────
  const codeBlocks: string[] = [];
  // handles ```, ```` (any fence length), with or without lang
  out = out.replace(
    /(`{3,})([ \t]*)([^\n`]*)\n([\s\S]*?)\1[ \t]*(\n|$)/gm,
    (_match, fence, _sp, langLine, body) => {
      const lang = normaliseLang(langLine.trim().split(/\s+/)[0] ?? "");
      const safeBody = body.endsWith("\n") ? body : body + "\n";
      const idx = codeBlocks.length;
      codeBlocks.push(`\`\`\`${lang}\n${safeBody}\`\`\``);
      return `%%CODE_${idx}%%\n`;
    }
  );

  // ── 2. EXTRACT inline code ─────────────────────────────────────────────
  const inlineCodes: string[] = [];
  out = out.replace(/`[^`\n]+`/g, (match) => {
    const idx = inlineCodes.length;
    inlineCodes.push(match);
    return `%%INLINE_${idx}%%`;
  });

  // ── 3. Fix setext headings ─────────────────────────────────────────────
  // ALL variants:
  //   Title\n====    **Title**\n====    Title\n----    **Title**\n----
  const lines = out.split("\n");
  const fixed: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const curr = lines[i];
    const next = lines[i + 1] ?? "";

    if (/^=+\s*$/.test(next) && curr.trim()) {
      const text = curr.trim()
        .replace(/^\*\*(.+)\*\*$/, "$1")
        .replace(/^__(.+)__$/, "$1")
        .trim();
      fixed.push(`# ${text}`);
      i++;
    } else if (/^-{2,}\s*$/.test(next) && curr.trim()) {
      const text = curr.trim()
        .replace(/^\*\*(.+)\*\*$/, "$1")
        .replace(/^__(.+)__$/, "$1")
        .trim();
      fixed.push(`## ${text}`);
      i++;
    } else {
      fixed.push(curr);
    }
  }
  out = fixed.join("\n");

  // ── 4. Strip bold/italic from INSIDE headings ──────────────────────────
  // ### **Title** → ### Title
  // ## *Title*    → ## Title
  out = out.replace(
    /^(#{1,6}[ \t]+)(\*{1,2}|_{1,2})([^*_\n]+)\2[ \t]*$/gm,
    (_, hashes, _delim, text) => `${hashes}${text.trim()}`
  );

  // ── 5. Standalone bold/italic lines → headings ─────────────────────────
  // **Title** alone on a line → ## Title
  out = out.replace(
    /^[ \t]*\*\*([^*\n]+)\*\*[ \t]*$/gm,
    (_, text) => `## ${text.trim()}`
  );
  out = out.replace(
    /^[ \t]*__([^_\n]+)__[ \t]*$/gm,
    (_, text) => `## ${text.trim()}`
  );

  // ── 6. HTML cleanup ────────────────────────────────────────────────────
  out = out
    .replace(/&#x20;/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/<br\s*\/?>/gi, "\n\n")
    .replace(/<hr\s*\/?>/gi, "\n\n---\n\n")
    .replace(/<img[^>]*\/?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    // strip any remaining HTML tags (but not our placeholders)
    .replace(/<\/?[a-zA-Z][^>]*>/g, "");

  // ── 7. Fix bare URLs that MDXEditor reads as JSX ──────────────────────
  // https://... not already inside []() or <>
  out = out.replace(
    /(?<!\]\(|<)(https?:\/\/[^\s)\]"'<>]+)/g,
    "<$1>"
  );

  // ── 8. Escape stray < that look like JSX to MDXEditor ─────────────────
  // < not followed by valid HTML/URL start and not our placeholders
  out = out.replace(/<(?![a-zA-Z\/!]|https?:\/\/)/g, "&lt;");

  // ── 9. Collapse excessive blank lines ─────────────────────────────────
  out = out.replace(/\n{3,}/g, "\n\n").trim();

  // ── 10. Restore inline code ────────────────────────────────────────────
  out = out.replace(/%%INLINE_(\d+)%%/g, (_, i) => inlineCodes[Number(i)]);

  // ── 11. Restore code blocks ────────────────────────────────────────────
  out = out.replace(/%%CODE_(\d+)%%/g, (_, i) => codeBlocks[Number(i)]);

  return out;
}
