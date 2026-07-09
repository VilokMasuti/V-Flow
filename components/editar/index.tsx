"use client";

import {
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  codeBlockPlugin,
  codeMirrorPlugin,
  ConditionalContents,
  CreateLink,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  Separator,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import { basicDark } from "cm6-theme-basic-dark";
import { useTheme } from "next-themes";
import type { ForwardedRef } from "react";

import { cn } from "@/lib/utils";

import "@mdxeditor/editor/style.css";
import "./dark-editor.css";

interface Props {
  value: string;
  fieldChange: (value: string) => void;
  editorRef: ForwardedRef<MDXEditorMethods> | null;
  className?: string;
}

const Editor = ({
  value,
  editorRef,
  fieldChange,
  className,
  ...props
}: Props) => {
  const { resolvedTheme } = useTheme();

  const codeMirrorExtensions = resolvedTheme === "dark" ? [basicDark] : [];

  return (
    <MDXEditor
      markdown={value}
      ref={editorRef}
      className={cn(
        "background-light800_dark200 light-border-2 markdown-editor dark-editor w-full max-w-full min-w-0 overflow-hidden border",
        className
      )}
      onChange={fieldChange}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        imagePlugin(),
        //  "txt" not "" — MDXEditor maps "" to "N/A" internally which crashes
        codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            //  "" kept so existing content with no lang doesn't crash
            "":   "Unspecified",
            txt:  "Plain Text",
            js:   "JavaScript",
            jsx:  "JavaScript (React)",
            ts:   "TypeScript",
            tsx:  "TypeScript (React)",
            css:  "CSS",
            scss: "SCSS",
            sass: "Sass",
            html: "HTML",
            json: "JSON",
            sql:  "SQL",
            bash: "Bash",
            md:   "Markdown",
          },
          autoLoadLanguageSupport: true,
          codeMirrorExtensions,
        }),
        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" }),
        toolbarPlugin({
          toolbarContents: () => (
            <ConditionalContents
              options={[
                {
                  when: (editor) => editor?.editorType === "codeblock",
                  contents: () => <ChangeCodeMirrorLanguage />,
                },
                {
                  fallback: () => (
                    <>
                      <UndoRedo />
                      <Separator />
                      <BoldItalicUnderlineToggles />
                      <Separator />
                      <ListsToggle />
                      <Separator />
                      <CreateLink />
                      <InsertImage />
                      <Separator />
                      <InsertTable />
                      <InsertThematicBreak />
                      <InsertCodeBlock />
                    </>
                  ),
                },
              ]}
            />
          ),
        }),
      ]}
      {...props}
    />
  );
};

export default Editor;
