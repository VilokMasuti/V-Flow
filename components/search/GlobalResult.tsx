"use client";

import { FileQuestion, Loader2, MessageSquare, Tag, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { CommandGroup, CommandItem } from "@/components/ui/command";
import { globalSearch } from "@/lib/actions/general.action";

const RESULT_ICONS = {
  question: FileQuestion,
  user: User,
  answer: MessageSquare,
  tag: Tag,
} as const;

const TYPE_COLORS = {
  question: "text-blue-400",
  user: "text-green-400",
  answer: "text-yellow-400",
  tag: "text-purple-400",
} as const;

type ResultType = keyof typeof RESULT_ICONS;

const GlobalResult = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = (searchParams.get("global") ?? "").trim();
  const type = searchParams.get("type");

  const [result, setResult] = useState<GlobalSearchedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      // Do not call the server for blank input, and do not keep stale results around.
      if (!searchQuery) {
        setResult([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await globalSearch({
          query: searchQuery,
          type: type ?? null,
        });

        if (response.success && response.data) {
          setResult(response.data);
        } else {
          // Server actions can fail without throwing, so handle the false branch too.
          setResult([]);
        }
      } catch (error) {
        console.error("Global search failed:", error);
        setResult([]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchResults();
  }, [searchQuery, type]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-10">
        <Loader2 size={16} className="animate-spin text-primary-500" />
        <span className="font-dm-sans text-sm text-[#555]">Searching...</span>
      </div>
    );
  }

  if (!isLoading && result.length === 0 && searchQuery) {
    return (
      <div className="flex flex-col items-center gap-2 py-10">
        <span className="text-2xl">Search</span>
        <p className="font-dm-sans text-sm text-[#555]">
          No results for <span className="text-[#888]">"{searchQuery}"</span>
        </p>
        <p className="font-dm-sans text-[11px] text-[#333]">
          Try searching with different keywords
        </p>
      </div>
    );
  }

  const grouped = result.reduce<Record<string, GlobalSearchedItem[]>>((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-1">
      {Object.entries(grouped).map(([groupType, items]) => {
        const Icon = RESULT_ICONS[groupType as ResultType] ?? FileQuestion;
        const colorClass = TYPE_COLORS[groupType as ResultType] ?? "text-[#888]";

        return (
          <CommandGroup
            key={groupType}
            heading={
              <span className="flex items-center gap-2 font-dm-sans text-[10px] uppercase tracking-widest text-[#333]">
                <Icon size={10} className={colorClass} />
                {groupType}s
              </span>
            }
          >
            {items.map((item) => (
              <CommandItem
                key={item.id}
                value={item.title}
                onSelect={() => {
                  const href =
                    groupType === "user"
                      ? `/profile/${item.id}`
                      : groupType === "tag"
                        ? `/tags/${item.id}`
                        : `/question/${item.id}`;

                  router.push(href);
                }}
                className="
                  group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5
                  transition-colors duration-150
                  aria-selected:bg-[#111] aria-selected:text-[#ededed]
                  data-[selected=true]:bg-[#111]
                "
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#2a2a2a] bg-[#0f0f0f]">
                  <Icon size={12} className={colorClass} />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-dm-sans text-[13px] text-[#ccc] group-aria-selected:text-[#ededed]">
                    {item.title}
                  </span>
                  <span className={`font-dm-sans text-[10px] capitalize ${colorClass} opacity-70`}>
                    {groupType}
                  </span>
                </div>

                <span className="ml-auto font-mono text-[10px] text-[#333] opacity-0 transition-opacity duration-100 group-aria-selected:opacity-100">
                  Enter
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        );
      })}
    </div>
  );
};

export default GlobalResult;
