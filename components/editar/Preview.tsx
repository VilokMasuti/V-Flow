import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

export const Preview = ({ content }: { content: string }) => {
  const formattedContent = content.replace(/&#x20;/g, "");

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
          pre: (props) => (
            <Code
              {...props}
              lineNumbers
              className=" text-neutral-50"
            />
          ),
        }}
      />
    </section>
  );
};
