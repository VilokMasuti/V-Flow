"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";

import GlobalFilter from "../filters/GlobalFilter";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("global") ?? "";

  const [search, setSearch] = useState(query);
  const [isOpen, setIsOpen] = useState(false);
  const trimmedSearch = search.trim();

  // Keep local input state aligned with the URL so refresh/back/clear feel consistent.
  useEffect(() => {
    setSearch(query);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const currentParams = searchParams.toString();

    const delayDebounceFn = setTimeout(() => {
      if (trimmedSearch) {
        const newUrl = formUrlQuery({
          params: currentParams,
          key: "global",
          value: trimmedSearch,
        });

        router.push(newUrl, { scroll: false });
      } else if (currentParams.includes("global=")) {
        const newUrl = removeKeysFromUrlQuery({
          params: currentParams,
          keysToRemove: ["global", "type"],
        });

        router.push(newUrl, { scroll: false });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [router, searchParams, trimmedSearch]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="
          group relative flex h-11 w-full max-w-[500px] max-lg:hidden
          items-center gap-3 rounded-xl border border-[#2a2a2a]
          bg-[#0a0a0a] px-4
          transition-all duration-200
          hover:border-[#3a3a3a] hover:bg-[#111111]
          focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-500
        "
        aria-label="Open global search"
      >
        <Search
          size={16}
          className="shrink-0 text-[#555] transition-colors duration-200 group-hover:text-primary-500"
        />

        <span className="flex-1 text-left font-dm-sans text-sm text-[#444] transition-colors duration-200 group-hover:text-[#666]">
          {query ? (
            <span className="text-[#888]">{query}</span>
          ) : (
            "Search anything globally..."
          )}
        </span>

        <kbd
          className="
            hidden items-center gap-1 rounded-md border border-[#2a2a2a]
            bg-[#111] px-2 py-1 font-mono text-[10px] text-[#444]
            sm:flex
          "
        >
          <span className="text-[11px]">Ctrl</span>K
        </kbd>
      </button>

      <CommandDialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setSearch("");
        }}
      >
        <div className="overflow-hidden rounded-2xl border border-[#1f1f1f] bg-[#0a0a0a] shadow-2xl shadow-black/60">
          <div className="flex items-center gap-3 border-b border-[#1a1a1a] px-4">
            <Search size={16} className="shrink-0 text-primary-500" />
            <CommandInput
              placeholder="Search questions, users, tags, answers..."
              value={search}
              onValueChange={(value) => {
                setSearch(value);
                if (!isOpen) setIsOpen(true);
              }}
              className="
                flex-1 border-none bg-transparent py-4
                font-dm-sans text-sm text-[#ededed]
                placeholder:text-[#444]
                focus:outline-none focus:ring-0
                [&>input]:bg-transparent
              "
            />
          </div>

          <GlobalFilter />

          <CommandList className="sidebar-scroll max-h-[400px] overflow-y-auto p-2">
            <CommandEmpty className="py-8 text-center">
              <p className="font-dm-sans text-sm text-[#555]">
                Start typing to search across DevFlow
              </p>
            </CommandEmpty>

            {/* Only mount the results panel when there is an actual query to search for. */}
            {trimmedSearch && <GlobalResult />}
          </CommandList>

          <div className="flex items-center justify-between border-t border-[#1a1a1a] px-4 py-2.5">
            <p className="font-dm-sans text-[11px] text-[#333]">
              DevFlow Global Search
            </p>
            <div className="flex items-center gap-3">
              <span className="font-dm-sans text-[11px] text-[#333]">
                <kbd className="rounded border border-[#2a2a2a] bg-[#111] px-1.5 py-0.5 font-mono text-[10px]">
                  Up/Down
                </kbd>{" "}
                navigate
              </span>
              <span className="font-dm-sans text-[11px] text-[#333]">
                <kbd className="rounded border border-[#2a2a2a] bg-[#111] px-1.5 py-0.5 font-mono text-[10px]">
                  Enter
                </kbd>{" "}
                select
              </span>
              <span className="font-dm-sans text-[11px] text-[#333]">
                <kbd className="rounded border border-[#2a2a2a] bg-[#111] px-1.5 py-0.5 font-mono text-[10px]">
                  Esc
                </kbd>{" "}
                close
              </span>
            </div>
          </div>
        </div>
      </CommandDialog>
    </>
  );
};

export default GlobalSearch;
