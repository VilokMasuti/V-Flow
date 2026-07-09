import { sanitiseMarkdown } from "@/lib/sanitise";
import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";
Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

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
