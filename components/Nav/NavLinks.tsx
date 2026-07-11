"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";

import { SheetClose } from "../ui/sheet";

const NavLinks = ({ isMobileNav = false, userId }: { isMobileNav?: boolean, userId: string }) => {
  const pathname = usePathname();


  return (
    <>
      {sidebarLinks.map((item) => {
        const isActive = (pathname.includes(item.route) && item.route.length > 1) || pathname === item.route;
        if (item.route === "/profile") {
          if (userId) item.route = `${item.route}/${userId}`;
          else return null;
        }
        const LinkComponent = (
          <Link
            href={item.route}
            key={item.label}
            className={cn(
              isActive ? "    bg-primary-500 rounded-md inset-0 font-sans mask-b-from-1" : "bg-black",
              "flex items-center justify-start gap-3    p-4  "
            )}
          >
            <Image
              src={item.imgURL}
              alt={item.label}
              width={20}
              height={20}
              className={cn({ "invert-colors ": !isActive })}
            />
            <p className={cn(isActive ? "base-bold font-inter" : "base-medium font-inter", !isMobileNav && "max-lg:hidden")}>{item.label}</p>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose asChild key={item.route}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={item.route}>{LinkComponent}</React.Fragment>
        );
      })}
    </>
  );
};
export default NavLinks;
