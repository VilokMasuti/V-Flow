import ROUTES from "@/constants/routes";
import { getDeviconClassName } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Badge } from "../ui/badge";

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
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const Content = (
    <>
      <Badge className="subtle-medium  flex flex-row gap-2 rounded-md  border-none px-4 py-2 uppercase dark:bg-zinc-800 bg-zinc-400">
        <div className="flex-center space-x-2  rounded-md invert-0">
          <i className={`${iconClass} text-sm`}></i>
          <span>{name}</span>
        </div>

        {remove && (
          <Image
            src="/icons/close.svg"
            width={12}
            height={12}
            alt="close icon"
            className="cursor-pointer object-contain invert-0 dark:invert"
            onClick={handleRemove}
          />
        )}
      </Badge>

      {showCount && <p className="small-medium text-dark500_light700">{questions}</p>}
    </>
  );
  if (compact) {
    return isButton ? (
      <button onClick={handleClick} className="flex justify-between gap-2">
        {Content}
      </button>
    ) : (
      <Link href={ROUTES.TAGS(_id)} className="flex justify-between gap-2">
        {Content}
      </Link>
    );
  }
};

export default TagCard;
