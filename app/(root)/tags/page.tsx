import type { Metadata } from "next";

import TagCard from "@/components/cards/TagCard";
import CommonFilter from '@/components/filters/CommonFilter';
import Pagination from '@/components/Pagination';
import LocalSearch from "@/components/search/LocalSearch";
import DataRenderer from "@/components/ui/DataRenderer";
import { TagFilters } from '@/constants/Filter';
import ROUTES from "@/constants/routes";
import { EMPTY_TAGS } from "@/constants/states";
import { getTags } from "@/lib/actions/tag.actions";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

export const metadata: Metadata = {
  title: "Tags | V-Flow",
  description: "Explore topics and categories across the V-Flow community.",
  openGraph: {
    title: "Tags | V-Flow",
    description: "Explore topics and categories across the V-Flow community.",
    type: "website",
    images: [{ url: "/images/logo.png", width: 1200, height: 630, alt: "V-Flow" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tags | V-Flow",
    description: "Explore topics and categories across the V-Flow community.",
    images: ["/images/logo.png"],
  },
};

const Tags = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const { tags,isNext } = data || {};

  return (
    <>
      <h1 className="h1-bold font-satoshi text-dark100_light900 text-3xl">Tags</h1>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.TAGS}
          imgSrc="/icons/search.svg"
          placeholder="Search tags..."
          otherClasses="flex-1"
          iconPosition="left"
        />
        <CommonFilter
        filters={TagFilters}
        otherClasses='min-h-[46px] w-full max-w-[560px]'

        />
      </section>
      <DataRenderer
        success={success}
        error={error}
        data={tags}
        empty={EMPTY_TAGS}
        render={(tags) => (
          <div className="mt-10 flex w-full flex-wrap gap-4">
            {tags.map((tag) => (
              <TagCard key={tag._id} {...tag} />
            ))}
          </div>
        )}
      />
             <Pagination isNext={isNext || false} page={page} containerClasses=' mt-12' />
    </>
  )
}

export default Tags
