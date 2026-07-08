
import ROUTES from "@/constants/routes";
import { getTimeStamp } from "@/lib/utils";

import Metric from "../Metric";
import LineHoverLink from '../ui/line-hover-link';
import EditDeleteAction from '../user/EditDeleteAction';
import TagCard from "./TagCard";

interface Props {
  question: Question;
  showActionBtns?: boolean;
}
const QuestionCard = ({ question: { _id, title, tags, author, createdAt, upvotes, answers, views } ,showActionBtns=false}: Props) => {
  return (
    <div className="card-wrapper  card  rounded-md shadow-md r p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div className=' flex-1'>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimeStamp(createdAt)}
          </span>
           <LineHoverLink
           variant='arc'
           className=' duration-1000 '
           href={ROUTES.QUESTION(_id)}>
            <h1 className="sm:h3-semibold  duration-1000 font-weight:400  line-height:1.7  text-dark100_light900 tracking-[-0.01em]  line-clamp-1 flex-1"
            >{title}</h1>
          </LineHoverLink>
        </div>
          {showActionBtns && <EditDeleteAction type="Question" itemId={_id} />}
      </div>
      <div className="mt-3.5 flex w-full flex-wrap gap-2">
        {tags.map((tag) => (
          <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
        ))}
      </div>
      <div className="flex-between mt-6 w-full flex-wrap gap-3">
        <Metric
          imgUrl={author.image}
          alt={author.name}
          value={author.name}
          title={`• asked ${getTimeStamp(createdAt)}`}
          href={ROUTES.PROFILE(author._id)}
          textStyles="body-medium text-dark400_light700"
          isAuthor
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/icons/like.svg"
            alt="like"
            value={upvotes}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/message.svg"
            alt="answers"
            value={answers}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/icons/eye.svg"
            alt="views"
            value={views}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </div>
  );
};
export default QuestionCard;
