"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { formUrlQuery } from "@/lib/url";

const FILTER_TYPES = [
  { name: "Question", value: "question" },
  { name: "Answer", value: "answer" },
  { name: "User", value: "user" },
  { name: "Tag", value: "tag" },
];

const GlobalFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // The URL is the single source of truth for the active filter.
  const activeType = searchParams.get("type") ?? "";

  const handleTypeClick = (value: string) => {
    const nextType = activeType === value ? null : value;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "type",
      value: nextType,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2 border-b border-[#1a1a1a] px-4 py-3">
      <span className="shrink-0 font-dm-sans text-[11px] uppercase tracking-wider text-[#444]">
        Filter:
      </span>

      <div className="flex flex-wrap gap-2">
        {FILTER_TYPES.map((item) => {
          const isActive = activeType === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => handleTypeClick(item.value)}
              className={`
                cursor-pointer rounded-lg border px-3 py-1 font-dm-sans text-[11px] font-medium
                transition-all duration-150
                ${isActive
                  ? "border-primary-500 bg-primary-500 text-black"
                  : "border-[#2a2a2a] bg-[#111] text-[#666] hover:border-[#3a3a3a] hover:text-[#999]"
                }
              `}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GlobalFilter;
