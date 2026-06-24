import Link from "next/link";

import { auth } from "@/auth";
import QuestionCard from "@/components/cards/QuestionCard";
import CommonFilter from '@/components/filters/CommonFilter';
import HomeFilter from "@/components/filters/HomeFilters";
import Pagination from '@/components/Pagination';
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import DataRenderer from "@/components/ui/DataRenderer";
import { HomePageFilters } from '@/constants/Filter';
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getQuestions } from "@/lib/actions/question.action";
interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}


export default async function Home({ searchParams }: SearchParams) {
  const session = await auth();

  console.log("Session: ", session);
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 2,
    query: query || "",
    filter: filter || "",
  });

  const { questions } = data || {};
  return (
    <main className='container relative mx-auto  flex w-full flex-col  px-4 sm:px-4 lg:px-6'>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-8 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          iconPosition="left"
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="w-full max-w-[560px]"
        />

         <CommonFilter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] w-full max-w-[560px]"
          containerClasses="hidden max-md:flex w-full"
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
      <Pagination/>
    </main>
  );
}
