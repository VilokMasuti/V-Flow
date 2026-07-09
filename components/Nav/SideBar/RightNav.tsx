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
<section className="pt-36 border-l duration-1000 [border-image:linear-gradient(180deg,transparent,#2a2a2a_20%,#2a2a2a_80%,transparent)_1] shadow-xl sticky right-0 top-0 flex h-screen w-[350px] flex-col p-6 max-xl:hidden overflow-hidden">

  {/* TOP QUESTIONS — takes ~50% height, scrolls internally */}
  <div className="flex flex-col" style={{ flex: "0 0 45%", minHeight: 0 }}>
    <h3 className="h3-bold text-dark200_light900 shrink-0">Top Questions</h3>
    <div className="mt-7 flex-1 min-h-0 overflow-y-auto sidebar-scroll pr-2">
      <DataRenderer
        data={hotQuestions}
        empty={{ title: "No questions found", message: "No questions have been asked yet." }}
        success={success}
        error={error}
        render={(hotQuestions) => (
          <div className="flex w-full flex-col gap-[30px] pb-2">
            {hotQuestions.map(({ _id, title }) => (
              <LineHoverLink
                variant="scribble"
                key={_id}
                href={ROUTES.QUESTION(_id)}
                className="flex cursor-pointer items-center justify-between gap-7 group duration-1000"
              >
                <span className="flex gap-3 items-center">
                  <p className="body-medium text-dark500_light700 font-inter line-clamp-2 duration-700 group-hover:bg-black!">
                    {title}
                  </p>
                  <Image
                    src="/icons/chevron-right.svg"
                    alt="Chevron"
                    width={20}
                    height={20}
                    className="shrink-0 duration-700 group-hover:brightness-0 group-hover:invert group-hover:filter"
                  />
                </span>
              </LineHoverLink>
            ))}
          </div>
        )}
      />
    </div>
  </div>

  {/* DIVIDER */}
  <div className="my-4 h-px w-full shrink-0 bg-[#1e1e1e]" />

  {/* POPULAR TAGS — takes remaining ~50%, scrolls internally */}
  <div className="flex flex-col" style={{ flex: "1 1 0%", minHeight: 0 }}>
    <h3 className="h3-bold text-dark200_light900 shrink-0">Popular Tags</h3>
    <div className="mt-7 flex-1 min-h-0 overflow-y-auto sidebar-scroll pr-2">
      <DataRenderer
        data={tags}
        empty={{ title: "No tags found", message: "No tags have been created yet." }}
        success={tagSuccess}
        error={tagError}
        render={(tags) => (
          <div className="flex flex-col gap-4 pb-2">
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
