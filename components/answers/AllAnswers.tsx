import { EMPTY_ANSWERS } from "@/constants/states"
import AnswerCard from "../cards/AnswerCard"
import DataRenderer from "../ui/DataRenderer"

interface Props extends ActionResponse<Answer[]> {
  totalAnswers: number
}
const AllAnswers = ({ data, error, success, totalAnswers }: Props) => {
  return (
    <div className="mt-11 w-full min-w-0">
      <div className="flex min-w-0 items-center justify-between">
        <h3 className=" primary-text-gradient">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
        <p>Filter</p>
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
    </div>
  )
}

export default AllAnswers
