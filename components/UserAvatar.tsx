import Link from "next/link";

import ROUTES from "@/constants/routes";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Props {
  id: string;
  name?: string | null;
  imageUrl?: string | null;
  className?: string;
  fallbackClassName?: string;
}

const UserAvatar = ({
  id,
  name,
  imageUrl,
  className = "h-9 w-9",
  fallbackClassName,
}: Props) => {
  const displayName = name?.trim() || "User";
  const initials =
    displayName
      .split(/\s+/)
      .map((word: string) => word[0])
      .filter(Boolean)
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <Link
      href={ROUTES.PROFILE(id)}
      className="inline-flex rounded-full transition-transform duration-200 hover:scale-[1.03]"
    >
      <Avatar
        className={cn(
          "ring-background overflow-hidden rounded-full border border-light-800/80 shadow-sm ring-2 dark:border-dark-400/70",
          className
        )}
      >
        <AvatarImage
          src={imageUrl || undefined}
          alt={displayName}
          className="object-cover"
        />
        <AvatarFallback
          className={cn(
            "bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 font-space-grotesk font-bold tracking-[0.18em] text-white",
            fallbackClassName
          )}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
};

export default UserAvatar;
