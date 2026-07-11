"use server";

import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";

import action from "../handlers/actions";
import handleError from "../handlers/error";
import { ValidationError } from "../http-errors";
import { GlobalSearchSchema } from "../validations";

type SearchType = GlobalSearchedItem["type"];
type SearchField = "title" | "name" | "content";

type SearchDocument = {
  _id: unknown;
  question?: unknown;
  title?: string;
  name?: string;
  content?: string;
};

type SearchConfig = {
  searchField: SearchField;
  runSearch: (searchRegex: RegExp, limit: number) => Promise<SearchDocument[]>;
};

const SEARCHABLE_TYPES: SearchType[] = ["question", "answer", "user", "tag"];

const SEARCH_CONFIG: Record<SearchType, SearchConfig> = {
  question: {
    searchField: "title",
    runSearch: async (searchRegex, limit) =>
      (await Question.find({ title: searchRegex }).limit(limit).lean()) as SearchDocument[],
  },
  answer: {
    searchField: "content",
    runSearch: async (searchRegex, limit) =>
      (await Answer.find({ content: searchRegex }).limit(limit).lean()) as SearchDocument[],
  },
  user: {
    searchField: "name",
    runSearch: async (searchRegex, limit) =>
      (await User.find({ name: searchRegex }).limit(limit).lean()) as SearchDocument[],
  },
  tag: {
    searchField: "name",
    runSearch: async (searchRegex, limit) =>
      (await Tag.find({ name: searchRegex }).limit(limit).lean()) as SearchDocument[],
  },
};

function escapeRegex(value: string) {
  // Treat the user's input as plain text, not as regex control characters.
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatSearchResult(
  item: SearchDocument,
  type: SearchType,
  searchField: SearchField,
  query: string
): GlobalSearchedItem {
  const resultId = type === "answer" ? item.question ?? item._id : item._id;

  return {
    id: String(resultId),
    type,
    title: type === "answer" ? `Answers containing "${query}"` : String(item[searchField] ?? ""),
  };
}

export async function globalSearch(
  params: GlobalSearchParams
): Promise<ActionResponse<GlobalSearchedItem[]>> {
  try {
    const validationResult = await action({
      params,
      schema: GlobalSearchSchema,
    });

    if (validationResult instanceof Error) {
      return handleError(validationResult) as ErrorResponse;
    }

    const { query, type } = validationResult.params;
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return { success: true, data: [] };
    }

    const typeLower = type?.toLowerCase();

    if (typeLower && !SEARCHABLE_TYPES.includes(typeLower as SearchType)) {
      return handleError(
        new ValidationError({ type: ["Invalid search type"] })
      ) as ErrorResponse;
    }

    const searchRegex = new RegExp(escapeRegex(normalizedQuery), "i");
    const selectedTypes = typeLower ? [typeLower as SearchType] : SEARCHABLE_TYPES;
    const limit = typeLower ? 8 : 2;

    // Each model owns its own query function, which keeps TypeScript from
    // mixing several Mongoose model overloads into one confusing union.
    const resultGroups = await Promise.all(
      selectedTypes.map(async (searchType) => {
        const { runSearch, searchField } = SEARCH_CONFIG[searchType];
        const docs = await runSearch(searchRegex, limit);

        return docs.map((item) =>
          formatSearchResult(item, searchType, searchField, normalizedQuery)
        );
      })
    );

    return {
      success: true,
      data: resultGroups.flat(),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
