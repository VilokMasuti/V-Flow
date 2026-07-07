import type { Metadata } from "next";


import QuestionCard from "@/components/cards/QuestionCard";

import CommonFilter from "@/components/filters/CommonFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
;

import HomeFilter from '@/components/filters/HomeFilters';
import CornerButton from '@/components/ui/corner-button';
import DataRenderer from '@/components/ui/DataRenderer';
import { HomePageFilters } from '@/constants/Filter';
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getQuestions } from "@/lib/actions/question.action";
import { Link } from 'next-view-transitions';

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

export const metadata: Metadata = {
  title: "All Questions | V-Flow",
  description: "Browse the latest programming questions and answers on V-Flow.",
  openGraph: {
    title: "All Questions | V-Flow",
    description: "Browse the latest programming questions and answers on V-Flow.",
    type: "website",
    images: [{ url: "/images/logo.png", width: 1200, height: 630, alt: "V-Flow" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "All Questions | V-Flow",
    description: "Browse the latest programming questions and answers on V-Flow.",
    images: ["/images/logo.png"],
  },
};

const Home = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { questions, isNext } = data || {};

  return (
    <>
<section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900 ">All Questions</h1>

        <CornerButton accentColor="#ff7000"
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"

        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </CornerButton>
      </section>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
          iconPosition="left"
        />

        <CommonFilter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </section>
      <HomeFilter />

      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />

      <Pagination page={page} isNext={isNext || false} />

    </>
  );
};

export default Home;
