"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import UserAvatar from "@/components/UserAvatar";
import { ChevronDown, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface Props {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  expires?: string | null; // session.expires ISO string
}

export default function UserChip({ id, name, email, image, expires }: Props) {
  const expiry = expires
    ? new Date(expires).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="group  cursor-pointer flex items-center gap-2 rounded-l-full border border-white/10 bg-white/[0.04] py-[3px] pl-[3px] pr-3 transition-all hover:border-white/20 hover:bg-white/[0.07] data-[state=open]:border-primary-500/35 data-[state=open]:bg-primary-500/[0.05]">
          <UserAvatar
            id={id}
            name={name}
            imageUrl={image}
            className="size-[26px] rounded-full ring-[1.5px] ring-primary-500/40"
          />
          <span className="max-w-[120px] truncate text-[12.5px] font-medium leading-none text-light-900 max-sm:hidden">
            {name}
          </span>
          <ChevronDown
            size={13}
            className="text-dark-400 transition-all group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary-500"
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-60 rounded-xl border border-white/10 bg-dark-200 p-0 shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 border-b border-white/[0.07] px-3.5 py-3.5">
          <div className="relative shrink-0">
            <UserAvatar
              id={id}
              name={name}
              imageUrl={image}
              className="size-9 rounded-full ring-2 ring-primary-500/30"
            />
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-500 ring-2 ring-dark-300" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-light-900">
              {name}
            </p>
            <p className="truncate text-[11px]  text-lime-50">{email}</p>
          </div>
        </div>

        {/* Session info */}
        <div className="space-y-0 px-3.5 py-2">
          <div className="flex items-center justify-between py-1.5 text-[11px]">
            <span className="text-light-500">Status</span>
            <span className="flex items-center gap-1.5 text-green-400">
              <span className="size-1.5 rounded-full bg-green-500" />
              Active
            </span>
          </div>
          {expiry && (
            <div className="flex items-center justify-between border-t border-white/[0.05] py-1.5 text-[11px]">
              <span className="text-light-500">Session expires</span>
              <span className="tabular-nums text-light-500">{expiry}</span>
            </div>
          )}
        </div>

        {/* Sign out */}
        <div className="border-t border-white/[0.07] p-2">
          <button
            onClick={() => signOut({ callbackUrl: "/sign-in" })}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 cursor-pointer text-[12px] font-medium text-red-500 transition-colors hover:bg-red-500/[0.08]"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
