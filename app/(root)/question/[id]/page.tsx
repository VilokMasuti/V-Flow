import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { Suspense } from "react";

import AllAnswers from "@/components/answers/AllAnswers";
import TagCard from "@/components/cards/TagCard";
import { Preview } from "@/components/editar/Preview";
import AnswerForm from "@/components/froms/AnswerForm";
import Metric from "@/components/Metric";
import SaveQuestion from "@/components/questions/SaveQuestion";
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from "@/components/UserAvatar";
import Votes from "@/components/votes/Votes";
import ROUTES from "@/constants/routes";
import { getAnswers } from "@/lib/actions/answer.action";
import { hasSavedQuestion } from "@/lib/actions/collection.action";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { hasVoted } from "@/lib/actions/vote.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import type { Metadata } from "next";

const stripMetadataText = (value: string = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {

  const { id } = await params;
  const { success, data: question } = await getQuestion({ questionId: id });

  if (!success || !question) {
    return {
      title: "Question not found |DevFlow",
      description: "The requested question could not be found.",
      openGraph: {
        title: "Question not found |DevFlow",
        description: "The requested question could not be found.",
        type: "website",
     siteName: "DevFlow",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Question not found |DevFlow",
        description: "The requested question could not be found.",

    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
      },
    };
  }

  const description = stripMetadataText(question.content).slice(0, 160) || "Explore this question on DevFlow.";

  return {
    title: `${question.title} |DevFlow`,
    description,
    alternates: {
      canonical: `/question/${id}`,
    },
    openGraph: {
      title: question.title,
      description,
      type: "article",
      url: `/question/${id}`,
       siteName: "DevFlow",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: question.title,
      description,

    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  };
}

const QuestionDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { success, data: question } = await getQuestion({ questionId: id });
  const { page, pageSize, filter } = await searchParams;
  after(async () => {
    await incrementViews({ questionId: id });
  });
  if (!success || !question) return redirect("/404");
  const {
    success: areAnswersLoaded,
    data: answersResult,
    error: answersError,
  } = await getAnswers({
    questionId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter,
  });

  const hasVotedPromise = hasVoted({
    targetId: question._id,
    targetType: "question",
  });

  const hasSavedQuestionPromise = hasSavedQuestion({
    questionId: question._id,
  });
  const { author, createdAt, answers, views, tags, content, title, upvotes, downvotes } = question;

  return (
    <main className="w-full min-w-0">
      <div className="flex-start w-full min-w-0 flex-col">
        <div className="flex w-full min-w-0 flex-col-reverse justify-between gap-4 sm:flex-row">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author._id}
              name={author.name}
              imageUrl={author.image}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">{author.name}</p>
            </Link>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-4">
  <Suspense
    fallback={
      <div className="flex items-center gap-2">
        <Skeleton className="size-7 rounded-md" />
        <Skeleton className="h-4 w-5" />
        <Skeleton className="size-7 rounded-md" />
        <Skeleton className="h-4 w-5" />
      </div>
    }
  >
    <Votes
      targetType="question"
      upvotes={question.upvotes}
      downvotes={question.downvotes}
      targetId={question._id}
      hasVotedPromise={hasVotedPromise}
    />
  </Suspense>

  <Suspense fallback={<Skeleton className="size-7 rounded-md" />}>
    <SaveQuestion
      questionId={question._id}
      hasSavedQuestionPromise={hasSavedQuestionPromise}
    />
  </Suspense>
</div>
        </div>

        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full min-w-0 break-words">{title}</h2>
      </div>

      <div className="mt-5 mb-8 flex min-w-0 flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={answers}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>

      <Preview content={content} />

      <div className="mt-8 flex min-w-0 flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <TagCard key={tag._id} _id={tag._id as string} name={tag.name} compact />
        ))}
      </div>

      <section className="my-5 min-w-0">
        <AllAnswers
          page={Number(page) || 1}
          isNext={answersResult?.isNext || false}
          data={answersResult?.answers}
          success={areAnswersLoaded}
          error={answersError}
          totalAnswers={answersResult?.totalAnswers || 0}
        />
      </section>

      <section className="my-5 min-w-0">
        <AnswerForm questionId={question._id} questionTitle={question.title} questionContent={question.content} />
      </section>
    </main>
  );
};

export default QuestionDetails;
