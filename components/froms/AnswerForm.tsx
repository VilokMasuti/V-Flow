"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { createAnswer } from "@/lib/actions/answer.action";
import { api } from "@/lib/api";
import { sanitiseMarkdown } from '@/lib/sanitise';
import { AnswerSchema } from "@/lib/validations";
import CornerButton from "../ui/corner-button";
import CreepyButton from "../ui/creepy-button";


const Editor = dynamic(() => import("@/components/editar"), { ssr: false });

interface Props {
  questionId: string;
  questionTitle: string;
  questionContent: string;
}

const AnswerForm = ({ questionId, questionTitle, questionContent }: Props) => {
  const [isAnswering, startAnsweringTransition] = useTransition();
  const [isAISubmitting, setIsAISubmitting] = useState(false);
  const [editorVersion, setEditorVersion] = useState(0);
  const router = useRouter();
  const session = useSession();
  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: { content: "" },
  });

  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    const editorContent = editorRef.current?.getMarkdown() ?? "";
    const content =
      editorContent.trim().length >= values.content.trim().length
        ? editorContent
        : values.content;

    if (content.trim().length < 100) {
      form.setError("content", {
        message: "Answer has to have more than 100 characters.",
      });
      return;
    }

    startAnsweringTransition(async () => {
      const result = await createAnswer({ questionId, content });

      if (result.success) {
        form.reset();
        editorRef.current?.setMarkdown("");
        setEditorVersion((v) => v + 1);
        router.refresh();
        toast.success("Success", {
          description: "Your answer has been posted successfully",
        });
      } else {
        toast.error("Error", {
          description: result.error?.message ?? "Failed to post your answer",
        });
      }
    });
  };

  const generateAIAnswer = async () => {
    if (!session.data) {
      return toast.error("Unauthorized", {
        description: "You need to be logged in to generate an AI answer",
      });
    }

    setIsAISubmitting(true);

    try {
      const userAnswer = editorRef.current?.getMarkdown() ?? "";

      const { success, data, error } = await api.ai.getAnswer(
        questionTitle,
        questionContent,
        userAnswer
      );

      if (!success) {
        return toast.error("Error", {
          description: error?.message ?? "Failed to generate AI answer",
        });
      }

      //  Sanitise BEFORE giving to MDXEditor
      // This fixes setext headings, bold headings, bare code blocks etc.
      // that would crash MDXEditor with {"type":"code","name":"N/A"}
      const sanitised = sanitiseMarkdown(
        data.replace(/<br>/g, " ").trim()
      );

      // Form value first so it is ready if editor remounts
      form.setValue("content", sanitised, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      //  Then push sanitised content into editor
      if (editorRef.current) {
        editorRef.current.setMarkdown(sanitised);
      } else {
        setEditorVersion((v) => v + 1);
      }

      toast.success("AI Answer Generated", {
        description: "Review the answer and click Post Answer when ready.",
      });
    } catch {
      toast.error("Error", {
        description: "Failed to generate AI answer",
      });
    } finally {
      setIsAISubmitting(false);
    }
  };

  return (
    <div className="w-full min-w-0">
      <div className="flex w-full min-w-0 flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <CreepyButton
          type="button"
          className="btn light-border-2 text-primary-500 dark:text-primary-500 w-full cursor-pointer justify-center gap-2.5 rounded-md border px-4 py-2.5 shadow-none sm:w-fit"
          disabled={isAISubmitting}
          onClick={generateAIAnswer}
        >
          {isAISubmitting ? (
            <>
              <ReloadIcon className="mr-2 size-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate AI Answer"
          )}
        </CreepyButton>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 flex w-full min-w-0 flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex w-full min-w-0 flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    key={editorVersion}
                    value={field.value}
                    editorRef={editorRef}
                    fieldChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <CornerButton
              accentColor="#ff7000"
              type="submit"
              className="primary-gradient w-fit"
              disabled={isAnswering}
            >
              {isAnswering ? "Posting..." : "Post Answer"}
            </CornerButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
