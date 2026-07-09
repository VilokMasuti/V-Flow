import ROUTES from "@/constants/routes";
import Image from "next/image";


import { getHotQuestions } from "@/lib/actions/question.action";

import TagCard from '@/components/cards/TagCard';
import DataRenderer from '@/components/ui/DataRenderer';
import LineHoverLink from '@/components/ui/line-hover-link';
import { getTopTags } from "@/lib/actions/tag.actions";

const RightSidebar = async () => {
  const [
    { success, data: hotQuestions, error },
    { success: tagSuccess, data: tags, error: tagError },
  ] = await Promise.all([getHotQuestions(), getTopTags()]);

  return (
 <section className="
      sticky right-0 top-0
      h-screen w-[350px]
      flex flex-col
      border-l border-[#1a1a1a]
      shadow-[-1px_0_0_0_rgba(255,112,0,0.05)]
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
              <div className="flex w-full flex-col gap-7 pb-3">
                {hotQuestions.map(({ _id, title }) => (
                  <LineHoverLink
                    variant="scribble"
                    key={_id}
                    href={ROUTES.QUESTION(_id)}
                    className="flex cursor-pointer items-center justify-between gap-4 group"
                  >
                    <p className="body-medium text-dark500_light700 font-inter line-clamp-2 min-w-0 flex-1">
                      {title}
                    </p>
                    <Image
                      src="/icons/chevron-right.svg"
                      alt=""
                      width={16}
                      height={16}
                      className="shrink-0 opacity-40 group-hover:opacity-100 group-hover:brightness-0 group-hover:invert transition-all"
                    />
                  </LineHoverLink>
                ))}
              </div>
            )}
          />
        </div>
      </div>

      {/* DIVIDER */}
      <div className="mx-6 shrink-0 h-px bg-[#1e1e1e]" />

      {/* POPULAR TAGS */}
      <div className="flex flex-col min-h-0 flex-1 px-6 pt-3 pb-6">
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
