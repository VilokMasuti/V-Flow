import { formatNumber } from '@/lib/utils';
import Image from 'next/image';

interface Props {
  totalAnswers: number;
  totalQuestions: number;
  badges: BadgeCounts;
  reputationPoints: number;
}

interface StatsCardProps {
  imgUrl: string;
  value: number;
  title: string;

}

const StatsCard = ({ imgUrl, value, title, }: StatsCardProps) => (
  <div className="border-[#1c1c1c] hover:border-[#2a2a2a]  transition-colors duration-150  flex flex-wrap items-center justify-start gap-4 rounded-md border p-6 ">
    <Image src={imgUrl} alt={title} width={40} height={50} />
    <div>
      <p className="paragraph-semibold text-dark200_light900">{value}</p>
      <p className="body-medium text-dark300_light700">{title}</p>
    </div>
  </div>
);

const Stats = ({ totalAnswers, totalQuestions, badges, reputationPoints }: Props) => {
  return (
     <div className="mt-3">
       <h4 className="h3-semibold text-dark200_light900 antialiased u">
        Stats{" "}
        <span className="small-semibold primary-text-gradient text-xs">
          {formatNumber(reputationPoints)}
        </span>
      </h4>

      <div className="border-card flex flex-wrap items-center justify-evenly gal-4 rounded-md border p-6  dark:shadow-dark-200">
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
          <StatsCard
          imgUrl="/icons/gold-medal.svg"
          value={badges.GOLD}
          title="Gold Badges"

        />
        <StatsCard
          imgUrl="/icons/silver-medal.svg"
          value={badges.SILVER}
          title="Silver Badges"

        />
        <StatsCard
          imgUrl="/icons/bronze-medal.svg"
          value={badges.BRONZE}
          title="Bronze Badges"

        />
      </div>
      </div>

  )
}

export default Stats
