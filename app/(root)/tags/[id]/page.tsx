import type { Metadata } from "next";

import QuestionCard from "@/components/cards/QuestionCard";
import LocalSearch from "@/components/search/LocalSearch";
import DataRenderer from "@/components/ui/DataRenderer";
import ROUTES from "@/constants/routes";
import { EMPTY_QUESTION } from "@/constants/states";
import { getTagQuestions } from "@/lib/actions/tag.actions";

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { id } = await params;
  const { success, data } = await getTagQuestions({ tagId: id, page: 1, pageSize: 1, query: "" });

  if (!success || !data?.tag) {
    return {
      title: "Tag not found | V-Flow",
      description: "The requested tag could not be found.",
    };
  }

  const description = `Explore questions tagged with ${data.tag.name} on V-Flow.`;

  return {
    title: `${data.tag.name} | V-Flow`,
    description,
    alternates: {
      canonical: ROUTES.TAG(id),
    },
    openGraph: {
      title: `${data.tag.name} | V-Flow`,
      description,
      type: "website",
      url: ROUTES.TAG(id),
      images: [{ url: "/images/logo.png", width: 1200, height: 630, alt: "V-Flow" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.tag.name} | V-Flow`,
      description,
      images: ["/images/logo.png"],
    },
  };
}

const Page = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, query } = await searchParams;
  const { success, data, error } = await getTagQuestions({
    tagId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
  });

  const { tag, questions } = data || {};

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">

        <h1 className="h1-bold font-satoshi text-dark100_light900">{tag?.name}</h1>


      </section>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAG(id)}
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
          iconPosition="left"
        />
      </section>
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
    </>
  )
}

export default Page
