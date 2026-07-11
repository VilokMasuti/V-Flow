"use server";

import type { QueryFilter, SortOrder } from "mongoose";
import mongoose, { Types } from "mongoose";
import { revalidatePath } from 'next/cache';
import { after } from 'next/server';

import { auth } from '@/auth';
import Answer from '@/database/answer.model';
import Collection from '@/database/collection.model';
import Interaction from '@/database/interaction.model';
import Question, { IQuestion } from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tag, { ITag } from "@/database/tag.model";
import "@/database/user.model";
import Vote from '@/database/vote.model';



import action from "../handlers/actions";
import handleError from "../handlers/error";
import dbConnect from '../mongoose';
import {
  AskQuestionSchema,
  DeleteQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  IncrementViewsSchema,
  PaginatedSearchParamsSchema,
} from "../validations";
import { createInteraction } from './interaction';

export async function createQuestion(params: CreateQuestionParams): Promise<ActionResponse> {
  // Validate incoming data and confirm the user is logged in.
  const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  if (!validationResult?.params || !validationResult.session?.user?.id) {
    return handleError(new Error("Unauthorized")) as ErrorResponse;
  }

  // Pull the cleaned values out after validation passes.
  const { title, content, tags } = validationResult.params;

  // The logged-in user becomes the author of the question.
  const userId = validationResult.session.user.id;

  let session: mongoose.ClientSession | undefined;

  try {
    // Start a transaction so all related writes succeed or fail together.
    await dbConnect();
    session = await mongoose.startSession();
    session.startTransaction();
    // Create the main question document first.
    const [question] = await Question.create([{ title, content, author: userId }], { session });

    if (!question) {
      throw new Error("Failed to create question");
    }

    // Collect tag ids and question-tag links for later inserts/updates.
    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionDocuments = [];

    for (const tag of tags) {
      // Reuse an existing tag if it already exists, otherwise create it.
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session }
      );

      // Save the tag id so we can attach all tags to the question.
      tagIds.push(existingTag._id);

      // Prepare the join-table record for the question-tag relationship.
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }

    // Insert all question-tag relationship records in one go.
    await TagQuestion.insertMany(tagQuestionDocuments, { session });

    // Update the question document with the list of related tag ids.
    await Question.findByIdAndUpdate(question._id, { $push: { tags: { $each: tagIds } } }, { session });



    // log the interaction
    after(async () => {
      await createInteraction({
        action: "post",
        actionId: question._id.toString(),
        actionTarget: "question",
        authorId: userId as string,
      })
    })


    // Finalize the transaction and keep all changes.
    await session.commitTransaction();

    // Convert the Mongoose document into a plain object before returning it.
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    // Something failed, so undo every database change in this transaction.
    if (session) {
      try {
        await session.abortTransaction();
      } catch {
        // ignore abort errors from an unstarted or already-finished transaction
      }
    }

    return handleError(error) as ErrorResponse;
  } finally {
    // Always close the session, whether we succeeded or failed.
    if (session) {
      session.endSession();
    }
  }
}

export async function editQuestion(params: EditQuestionParams): Promise<ActionResponse<IQuestion & { _id: string }>> {
  const validationResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  if (!validationResult) {
    return handleError(new Error("Validation failed")) as ErrorResponse;
  }

  const { title, content, tags, questionId } = validationResult.params!;
  const userId = validationResult?.session?.user?.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    if (question.author.toString() !== userId) {
      throw new Error("Unauthorized");
    }

    if (question.title !== title || question.content !== content) {
      question.title = title;
      question.content = content;
      await question.save({ session });
    }

    const tagsToAdd = tags.filter(
      (tag) => !question.tags.some((t: ITag) => t.name.toLowerCase().includes(tag.toLowerCase()))
    );

    const tagsToRemove = question.tags.filter(
      (tag: ITag) => !tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
    );

    const newTagDocuments = [];

    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: `^${tag}$`, $options: "i" } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session }
        );

        if (existingTag) {
          newTagDocuments.push({
            tag: existingTag._id,
            question: questionId,
          });

          question.tags.push(existingTag._id);
        }
      }
    }

    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag: ITag) => tag._id);

      await Tag.updateMany({ _id: { $in: tagIdsToRemove } }, { $inc: { questions: -1 } }, { session });

      await TagQuestion.deleteMany({ tag: { $in: tagIdsToRemove }, question: questionId }, { session });

      // Populated tags are objects with _id, but freshly pushed tags are plain ObjectIds.
      question.tags = question.tags.filter((tag: mongoose.Types.ObjectId | ITag) => {
        const tagId = tag instanceof mongoose.Types.ObjectId ? tag : tag._id;

        return !tagIdsToRemove.some((id: mongoose.Types.ObjectId) => id.equals(tagId));
      }) as mongoose.Types.ObjectId[];
    }

    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, { session });
    }

    await question.save({ session });
    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}




export async function getRecommendedQuestions({
  userId,
  query,
  skip,
  limit,
}: RecommendationParams) {

  // Get user's recent interactions

  const interactions = await Interaction.find({
    user: new Types.ObjectId(userId),
    actionType: "question",
    action: { $in: ["view", "upvote", "bookmark", "post"] }
  })
    .sort({ updatedAt: -1, createdAt: -1 })
    .limit(50)
    .lean();

  const interactedQuestionIds = [...new Set(interactions.map((i) => i.actionId.toString()))].map(
    (id) => new Types.ObjectId(id)
  );

  // Get tags from interacted questions

  const interactedQuestions = await Question.find({
    _id: { $in: interactedQuestionIds }
  }).select("tags");

  // / Get unique tags

  const allTags = interactedQuestions.flatMap((q) => q.tags.map((tag: Types.ObjectId) => tag.toString())
  )

  // Remove duplicates
  const uniqueTagIds = [...new Set(allTags)];

  const recommendedQuery: QueryFilter<IQuestion> = {
    // exclude interacted questions
    _id: { $nin: interactedQuestionIds },
    // exclude the user's own questions
    author: { $ne: new Types.ObjectId(userId) },
  }

  if (uniqueTagIds.length > 0) {
    // include questions with any of the unique tags
    recommendedQuery.tags = { $in: uniqueTagIds.map((id) => new Types.ObjectId(id)) };
  }

  if (query) {
    recommendedQuery.$or = [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ];
  }

  const total = await Question.countDocuments(recommendedQuery);
  const questions = await Question.find(recommendedQuery)
    .populate("tags", "name")
    .populate("author", "name image")
    .sort({ upvotes: -1, views: -1, createdAt: -1 }) // prioritizing engagement
    .skip(skip)
    .limit(limit)
    .lean();
  return {
    questions: JSON.parse(JSON.stringify(questions)),
    isNext: total > skip + questions.length,
  };

}

import { cache } from "react";

export const getQuestion = cache(async function getQuestion(
  params: GetQuestionParams
): Promise<ActionResponse<Question>> {
  const validationResult = await action({
    params,
    schema: GetQuestionSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
    if (!validationResult) {
    return handleError(new Error("Validation failed")) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;


  try {
    const question = await Question.findById(questionId)
      .populate("tags", "_id name")
      .populate("author", "_id name image");

    if (!question) throw new Error("Question not found");

    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
});

export async function getQuestions(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const filterQuery: QueryFilter<IQuestion> = {};


  if (query) {
    filterQuery.$or = [{ title: { $regex: new RegExp(query, "i") } }, { content: { $regex: new RegExp(query, "i") } }];
  }

  let sortCriteria: Record<string, SortOrder> = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "unanswered":
      filterQuery.answers = 0;
      sortCriteria = { createdAt: -1 };
      break;
    case "popular":
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {


    // Recommendations

    if (filter === 'recommended') {
      const session = await auth()
      const userId = session?.user?.id

      if (!userId) {
        return { success: true, data: { questions: [], isNext: false } };
      }

      const recommended = await getRecommendedQuestions({
        userId,
        query,
        skip,
        limit,
      })
      return { success: true, data: recommended };

    }
    // Search
    if (query) {
      filterQuery.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ];
    }

    // Filters
    switch (filter) {
      case "newest":
        sortCriteria = { createdAt: -1 };
        break;
      case "unanswered":
        filterQuery.answers = 0;
        sortCriteria = { createdAt: -1 };
        break;
      case "popular":
        sortCriteria = { upvotes: -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
        break;
    }
    const totalQuestions = await Question.countDocuments(filterQuery);

    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function incrementViews(params: IncrementViewsParams): Promise<ActionResponse<{ views: number }>> {
  const validationResult = await action({
    params,
    schema: IncrementViewsSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  if (!validationResult) {
    return handleError(new Error("Validation failed")) as ErrorResponse;
  }

  const { questionId } = validationResult.params;
  try {
    const question = await Question.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    question.views += 1;

    await question.save();

    const session = await auth();
    const userId = session?.user?.id;

    if (userId && question.author.toString() !== userId) {
      await Interaction.findOneAndUpdate(
        {
          user: new Types.ObjectId(userId),
          action: "view",
          actionId: question._id,
          actionType: "question",
        },
        {
          $set: {
            user: new Types.ObjectId(userId),
            action: "view",
            actionId: question._id,
            actionType: "question",
          },
        },
        { upsert: true, new: true }
      );
    }

    return {
      success: true,
      data: { views: question.views },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}


export async function getHotQuestions(): Promise<ActionResponse<Question[]>> {
  try {
    await dbConnect()
    const questions = await Question.find().sort({ views: -1, upvotes: -1 }).limit(5)

    return {
      success: true,
      data: JSON.parse(JSON.stringify(questions)),
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}


export async function deleteQuestion(params: DeleteQuestionParams): Promise<ActionResponse> {

  const validationResult = await action({
    params,
    schema: DeleteQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  if (!validationResult) {
    return handleError(new Error("Validation failed")) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;

  const { user } = validationResult.session!;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId);

    if (!question) {
      throw new Error("Question not found");
    }

    if (question.author.toString() !== user?.id) {
      throw new Error("You are not authorized to delete this question");
    }
    // Delete references from collection

    await Collection.deleteMany({ question: questionId }).session(session);

    // Delete references from TagQuestion collection
    await TagQuestion.deleteMany({ question: questionId }).session(session);

    // For all tags of Question, find them and reduce their count

    if (question.tags.length > 0) {
      await Tag.updateMany(
        { _id: { $in: question.tags } },
        { $inc: { questions: -1 } },
        { session }
      )
    }
    // Remove all votes of the question

    await Vote.deleteMany({
      id: questionId,
      type: "question"
    }).session(session);

    // Remove all answers and their votes of the question
    const answers = await Answer.find({ question: questionId }).session(
      session
    );


    if (answers.length > 0) {
      await Answer.deleteMany({ question: questionId }).session(session);

      await Vote.deleteMany({
        id: { $in: answers.map((answer) => answer._id) },
        type: "answer",
      }).session(session);
    }
    // Delete question
    await Question.findByIdAndDelete(questionId).session(session);

    // Commit transaction
    await session.commitTransaction();

    // Revalidate to reflect immediate changes on UI
    revalidatePath(`/profile/${user?.id}`);

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
