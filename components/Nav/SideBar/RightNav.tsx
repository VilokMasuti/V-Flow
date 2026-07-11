import ROUTES from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";

import TagCard from "@/components/cards/TagCard";
import DataRenderer from "@/components/ui/DataRenderer";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopTags } from "@/lib/actions/tag.actions";

const RightSidebar = async () => {
  const [
    { success, data: hotQuestions, error },
    { success: tagSuccess, data: tags, error: tagError },
  ] = await Promise.all([getHotQuestions(), getTopTags()]);

  return (
    <section
      className="
        sticky right-0 top-0
        h-screen w-[350px]
        flex flex-col
        border-l
        [border-image:linear-gradient(180deg,transparent,#2a2a2a_20%,#2a2a2a_80%,transparent)_1]
        max-xl:hidden
        overflow-hidden
      "
    >
      {/* Spacer for navbar height */}
      <div className="h-36 shrink-0" />

      {/* ── TOP QUESTIONS ── */}
      <div className="flex flex-col min-h-0 flex-1 px-6 pb-3">
        <h3 className="h2-bold text-dark200_light900 shrink-0 mb-4">
          Top Questions
        </h3>

        <div className="flex-1 min-h-0 overflow-y-auto sidebar-scroll pr-2">
          <DataRenderer
            data={hotQuestions}
            empty={{ title: "No questions found", message: "No questions yet." }}
            success={success}
            error={error}
            render={(hotQuestions) => (
              <div className="flex w-full flex-col gap-7">
                {hotQuestions.map(({ _id, title }) => (
                  <div
                    key={_id}
                    className="group relative flex w-full items-start justify-between gap-4"
                  >
                    {/* Full-row click target via after:absolute after:inset-0 */}
                    <Link href={ROUTES.QUESTION(_id)} className="after:absolute after:inset-0">
                      <span className="body-medium text-neutral-100  font-inter font-semibold line-clamp-2 transition-colors duration-700 group-hover:text-primary-500">
                        {title}
                      </span>
                    </Link>

                    {/* Chevron — turns orange on row hover via CSS filter */}
                    <Image
                      src="/icons/chevron-right.svg"
                      alt=""
                      aria-hidden="true"
                      width={16}
                      height={16}
                      className="
                        mt-[2px] shrink-0 opacity-30
                        transition-[opacity,filter] duration-700
                        group-hover:opacity-100 group-hover:[filter:invert(48%)_sepia(79%)_saturate(2476%)_hue-rotate(10deg)_brightness(118%)_contrast(119%)]
                      "
                    />
                  </div>
                ))}
              </div>
            )}
          />
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="mx-6 shrink-0 h-px bg-[#1e1e1e]" />

      {/* ── POPULAR TAGS ── */}
      <div className="flex flex-col min-h-0 flex-1 px-6 pt-8 pb-6">
        <h3 className="h3-bold text-dark200_light900 shrink-0 mb-4">
          Popular Tags
        </h3>

        <div className="flex-1 min-h-0 overflow-y-auto sidebar-scroll pr-2">
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
