

import TagCard from '@/components/cards/TagCard';
import DataRenderer from '@/components/ui/DataRenderer';
import ROUTES from '@/constants/routes';
import { getHotQuestions } from '@/lib/actions/question.action';
import { getTopTags } from '@/lib/actions/tag.actions';
import { FileQuestionMark } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';






const RightNav = async () => {


  const [
    { success, data: hotQuestions, error },
  { success: tagSuccess, data: tags, error: tagError }
  ] = await Promise.all([getHotQuestions(), getTopTags()]);

  return (
    <section className="custom-scrollbar background-light900_dark200 light-border shadow-light-300 sticky top-0 right-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 pt-36  dark:shadow-none">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>

        <div className="mt-7 flex w-full flex-col gap-[30px]">
          <DataRenderer
            data={hotQuestions}
            empty={{
              title: "No questions found",
              message: "No questions have been asked yet.",
            }}
            success={success}
            error={error}
            render={(hotQuestions) => (
              <div className="mt-7 flex w-full flex-col gap-[30px] ">
                {hotQuestions.map(({ _id, title }) => (
                  <Link
                    key={_id}
                    href={ROUTES.QUESTION(_id)}
                    className="flex cursor-pointer items-center justify-between gap-2 "
                  >
                    <FileQuestionMark width={20}
                      height={20} className='  text-orange-400 dark:invert-colors ' />
                    <p className="  text-neutral-200_dark700  line-clamp-1 w-[300px] text-left text-sm font-medium">
                      {title}
                    </p>

                    <Image
                      src="/icons/chevron-right.svg"
                      alt="Chevron"
                      width={20}
                      height={20}
                      className="   invert-colors"
                    />
                  </Link>
                ))}
              </div>
            )}

          />
        </div>
      </div>

      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>


        <DataRenderer
          data={tags}
          empty={{
            title: "No tags found",
            message: "No tags have been created yet.",
          }}
          success={tagSuccess}
          error={tagError}
          render={(tags) => (
            <div className="mt-7 flex flex-col gap-4">
              {tags.map(({ _id, name, questions }) => (
                < TagCard
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
    </section>
  );
};
export default RightNav;
