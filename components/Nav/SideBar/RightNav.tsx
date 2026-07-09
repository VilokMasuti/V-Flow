import ROUTES from "@/constants/routes";
import Image from "next/image";


import { getHotQuestions } from "@/lib/actions/question.action";

import TagCard from '@/components/cards/TagCard';
import DataRenderer from '@/components/ui/DataRenderer';
import { getTopTags } from "@/lib/actions/tag.actions";
import Link from 'next/link';

const RightSidebar = async () => {
  const [
    { success, data: hotQuestions, error },
    { success: tagSuccess, data: tags, error: tagError },
  ] = await Promise.all([getHotQuestions(), getTopTags()]);

  return (
    <section className="
      sticky right-0 top-0
      h-screen w-[350px]
      flex flex-col border-r
      border-l [border-image:linear-gradient(180deg,transparent,#2a2a2a_20%,#2a2a2a_80%,transparent)_1]
      max-xl:hidden
      overflow-hidden
    ">
      {/* Spacer for navbar height */}
      <div className="h-36 shrink-0" />

      {/* TOP QUESTIONS */}
      <div className="flex flex-col min-h-0 flex-1 px-6 pb-3">
        <h3 className="h3-bold text-dark200_light900 shrink-0 mb-6">
          Top Questions
        </h3>
        <div className="flex-1 min-h-0 overflow-y-auto sidebar-scroll pr-1">
          <DataRenderer
            data={hotQuestions}
            empty={{ title: "No questions found", message: "No questions yet." }}
            success={success}
            error={error}
            render={(hotQuestions) => (
              <div className="mt-7 flex w-full flex-col gap-[30px]">
                {hotQuestions.map(({ _id, title }) => (
                  <div key={_id} className="group relative flex w-full items-center justify-between gap-7">

                    {/* 1. Link wraps ONLY the text so the scribble stays perfectly proportioned */}
                    <Link

                      href={ROUTES.QUESTION(_id)}
                      className="after:absolute after:inset-0"
                    >
                      <span className="body-medium text-dark500_light700 font-inter line-clamp-2 duration-700">
                        {title}
                      </span>
                    </Link>

                    {/* 2. Chevron sits outside, perfectly right-aligned and safe from wrapping */}
                    <Image
                      src="/icons/chevron-right.svg"
                      alt="Chevron"
                      width={20}
                      height={20}
                      className="shrink-0 duration-700 group-hover:brightness-0 group-hover:invert group-hover:filter"
                    />
                  </div>
                ))}
              </div>
            )}
          />
        </div>
      </div>

      {/* DIVIDER */}
      <div className="mx-6 shrink-0 h-px bg-[#1e1e1e]" />

      {/* POPULAR TAGS */}
      <div className="flex flex-col min-h-0 flex-1 px-6 pt-10 pb-6">
        <h3 className="h3-bold text-dark200_light900 shrink-0 mb-6">
          Popular Tags
        </h3>
        <div className="flex-1 min-h-0 overflow-y-auto sidebar-scroll pr-1">
          <DataRenderer
            data={tags}
            empty={{ title: "No tags found", message: "No tags yet." }}
            success={tagSuccess}
            error={tagError}
            render={(tags) => (
              <div className="flex flex-col gap-3 pb-3">
                {tags.map(({ _id, name, questions }) => (
                  <TagCard
                    key={_id}
                    _id={_id}
                    name={name}
                    questions={questions}
                    showCount
                    compact
                  />
                ))}
              </div>
            )}
          />
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
