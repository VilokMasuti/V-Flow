"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import ROUTES from "@/constants/routes";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { AskQuestionSchema } from "@/lib/validations";

import TagCard from "../cards/TagCard";
import CornerButton from '../ui/corner-button';
import CreepyButton from '../ui/creepy-button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const Editor = dynamic(() => import("@/components/editar/index"), {
  ssr: false,
});

interface Params {
  question?: Question;
  isEdit?: boolean;
}

const QuestionForm = ({ question, isEdit }: Params) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [editorVersion, setEditorVersion] = useState(0);
  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: question?.title || "",
      content: question?.content || "",
      tags: question?.tags.map((tag: { name: string }) => tag.name) || [],
    },
  });
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: { value: string[] }) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim();
      if (tagInput && tagInput.length < 15 && !field.value.includes(tagInput)) {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      } else if (tagInput.length > 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag should be less than 15 characters",
        });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists",
        });
      }
    }
  };

  const handleTagRemove = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((t) => t !== tag);

    form.setValue("tags", newTags);

    if (newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "Tags are required",
      });
    }
  };

  const handleCreateQuestion = async (data: z.infer<typeof AskQuestionSchema>) => {
    startTransition(async () => {
      if (isEdit && question) {
        const result = await editQuestion({
          questionId: question?._id,
          ...data,
        });

        if (result.success) {
          toast.success("Question updated successfully", {
            description: "You can now view your question on the home page",
          });
          if (result.data) router.push(ROUTES.QUESTION(result.data._id));
        } else {
          toast.error("Failed to update question", {
            description: result.error?.message || "Something went wrong",
          });
        }
        return;
      }

      const result = await createQuestion(data);
      if (result.success) {
        toast.success("Question created successfully", {
          description: "You can now view your question on the home page",
        });
        if (result.data) router.push(ROUTES.QUESTION((result.data as { _id: string })._id));
      } else {
        toast.error("Failed to create question", {
          description: result.error?.message || "Something went wrong",
        });
      }
    });
  };

  const handleEnhanceQuestion = async () => {
    const title = form.getValues("title");
    const content = form.getValues("content");

    if (!title || !content) {
      return toast.error("Please fill in title and content first");
    }

    setIsEnhancing(true);

    try {
      const res = await fetch("/api/ai/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        return toast.error("Failed to enhance question");
      }

      const enhanced =
        typeof result.data === "string" ? { title, content: result.data, tags: form.getValues("tags") } : result.data;

      if (!enhanced?.title || !enhanced?.content || !Array.isArray(enhanced?.tags)) {
        return toast.error("AI returned an invalid question format");
      }

      form.setValue("title", enhanced.title, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      form.setValue("content", enhanced.content, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      form.setValue("tags", enhanced.tags, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
      form.clearErrors(["title", "content", "tags"]);

      if (editorRef.current) {
        editorRef.current.setMarkdown(enhanced.content);
      } else {
        setEditorVersion((version) => version + 1);
      }

      toast.success("Question enhanced!");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <Form {...form}>
      <form className="flex w-full flex-col gap-10" onSubmit={form.handleSubmit(handleCreateQuestion)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Be specific and imagine you&apos;re asking a question to another person.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed explanation of your problem <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <Editor key={editorVersion} value={field.value} editorRef={editorRef} fieldChange={field.onChange} />
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Introduce the problem and expand on what you&apos;ve put in the title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleInputKeyDown(e, field)}
                  />
                  <div className="flex-start mt-2.5 flex-wrap gap-2.5">
                    {field?.value?.map((tag: string) => (
                      <TagCard
                        key={tag}
                        _id={tag}
                        name={tag}
                        compact
                        remove
                        isButton
                        handleRemove={() => handleTagRemove(tag, field)}
                      />
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Add up to 3 tags to describe what your question is about. You need to press enter to add a tag.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-16 flex justify-end gap-3">
          {/* Enhance button */}
          <CreepyButton
            type="button"
            disabled={isEnhancing || isPending}
            onClick={handleEnhanceQuestion}
            className="   gap-1.5 primary-gradient text-light-900! "
          >
            {isEnhancing ? (
              <>
                <ReloadIcon className="mr-2 size-4 animate-spin" />
                Enhancing...
              </>
            ) : (
              "Enhance Question"
            )}
          </CreepyButton>
          <CornerButton accentColor="#ff7000" disabled={isPending} type="submit" className="min-h-[46px] px-4 py-3 !text-light-900 w-fit">
            {isPending ? (
              <>

                <span>Submitting</span>
              </>
            ) : (
              <>{isEdit ? "Edit" : "Ask a Question"}</>
            )}
          </CornerButton>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForm;
