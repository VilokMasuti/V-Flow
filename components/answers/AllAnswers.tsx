import { EMPTY_ANSWERS } from "@/constants/states"

import { AnswerFilters } from '@/constants/Filter'
import AnswerCard from "../cards/AnswerCard"
import CommonFilter from '../filters/CommonFilter'
import Pagination from '../Pagination'
import DataRenderer from "../ui/DataRenderer"

interface Props extends ActionResponse<Answer[]> {
  totalAnswers: number
  page: number;
  isNext: boolean;
}
const AllAnswers = ({ data, error, success, totalAnswers, page, isNext }: Props) => {
  return (
    <div className="mt-11 w-full min-w-0">
      <div className="flex min-w-0 items-center justify-between">
        <h3 className=" primary-text-gradient">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
        <CommonFilter
        filters={AnswerFilters}
        />
      </div>
      <DataRenderer
        data={data}
        error={error}
        success={success}
        empty={EMPTY_ANSWERS}
        render={(answers) =>
          answers.map((answer) => <AnswerCard key={answer._id} {...answer} />)
        }

      />
       <Pagination isNext={isNext || false} page={page} containerClasses=' mt-12' />
    </div>
  )
}

export default AllAnswers
