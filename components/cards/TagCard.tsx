import Image from "next/image";
import Link from "next/link";
import React from "react";

import ROUTES from "@/constants/routes";
import { cn, getDeviconClassName, getTechDescription } from "@/lib/utils";
import LineHoverLink from '../ui/line-hover-link';

interface Props {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  isButton?: boolean;
  handleRemove?: () => void;
}

const TagCard = ({ _id, name, questions, showCount, compact, remove, isButton, handleRemove }: Props) => {
  const iconClass = getDeviconClassName(name);
  const iconDescription = getTechDescription(name);
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const Content = (
    <>
      <div className="flex-center space-x-2 rounded-md invert-0">
        <i className={`${iconClass} text-sm`} />
        <span>{name}</span>
      </div>

      {remove && (
        <button
          type="button"
          className="cursor-pointer rounded-sm p-1"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleRemove?.();
          }}
          aria-label={`Remove ${name} tag`}
        >
          <Image src="/icons/close.svg" width={12} height={12} alt="close icon" className="object-contain" />
        </button>
      )}
    </>
  );

  if (compact) {
    return isButton ? (
      <button onClick={handleClick} className="flex justify-between gap-2">
        {Content}
      </button>
    ) : (
      <div className="flex justify-between ">
        <LineHoverLink
          href={ROUTES.TAG(_id)}
          variant="scribble"
          style={{ viewTransitionName: `tag-card-${_id}` }}
          className="subtle-medium flex flex-row gap-2 rounded-md border-none bg-[#1a1a1a] px-4 py-2 uppercase font-inter text-neutral-100 shadow-md leading-2.5 tracking-[0.03em]"
        >
          {Content}
        </LineHoverLink>

     {showCount && <p className="small-medium text-dark500_light700">{questions}</p>}
      </div>
    );
  }

  return (
    <Link href={ROUTES.TAG(_id)} style={{ viewTransitionName: `tag-card-${_id}` }} className="shadow-light100_darknone">
      <article className="background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-[260px]">
        <div className="flex items-center justify-between gap-3">
          <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
            <p className="paragraph-semibold text-dark300_light900">{name}</p>
          </div>
          <i className={cn(iconClass, "text-2xl")} aria-hidden="true" />
        </div>

        <p className="small-regular text-dark500_light700 mt-5 line-clamp-3 w-full">{iconDescription}</p>

        <p className="small-medium text-dark400_light500 mt-3.5">
          <span className="body-semibold primary-text-gradient mr-2.5">{questions}+</span>
        </p>
      </article>
    </Link>
  );
};

export default TagCard;
