"use server"

import Question from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tag from "@/database/tag.model";
import mongoose from "mongoose";
import action from "../handlers/actions";
import handleError from "../handlers/error";
import { AskQuestionSchema } from "../validations";

export async function createQuestion(params:CreateQuestionParams):Promise<ActionResponse>{
// Validate incoming data and confirm the user is logged in.
const validationResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
return handleError(validationResult) as ErrorResponse
  }

  // Pull the cleaned values out after validation passes.
  const {title,content,tags} = validationResult?.params!;

  // The logged-in user becomes the author of the question.
  const userId = validationResult?.session?.user?.id

  // Start a transaction so all related writes succeed or fail together.
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    // Create the main question document first.
    const [question] = await Question.create([{title,content,author:userId}],{session})

    if(!question){
       throw new Error("Failed to create question");
    }

    // Collect tag ids and question-tag links for later inserts/updates.
    const tagIds:mongoose.Types.ObjectId[] = []
    const tagQuestionDocuments = [];

    for(const tag of tags){
      // Reuse an existing tag if it already exists, otherwise create it.
      const  existingTag  = await Tag.findOneAndUpdate(
        {name:{$regex:new RegExp(`^${tag}$`, "i")}},
        {$setOnInsert: {name: tag}, $inc: {questions: 1}},
        {upsert: true,new:true, session}
      )

       // Save the tag id so we can attach all tags to the question.
       tagIds.push(existingTag._id);

       // Prepare the join-table record for the question-tag relationship.
       tagQuestionDocuments.push({
         tag: existingTag._id,
        question: question._id,
       })
    }
   
    // Insert all question-tag relationship records in one go.
    await TagQuestion.insertMany(tagQuestionDocuments,{session})

   // Update the question document with the list of related tag ids.
   await Question.findByIdAndUpdate(
    question._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
   )

// Finalize the transaction and keep all changes.
await session.commitTransaction();

    // Convert the Mongoose document into a plain object before returning it.
    return { success: true, data: JSON.parse(JSON.stringify(question)) };
  } catch (error) {
    // Something failed, so undo every database change in this transaction.
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    // Always close the session, whether we succeeded or failed.
    session.endSession()
  }



}
