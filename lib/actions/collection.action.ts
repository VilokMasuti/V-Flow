
"use server"

import ROUTES from '@/constants/routes';
import Collection from '@/database/collection.model';
import Question from '@/database/question.model';

import { revalidatePath } from 'next/cache';
import action from '../handlers/actions';
import handleError from '../handlers/error';
import { CollectionBaseSchema } from '../validations';




export async function ToggleQuestion(params: CollectionBaseParams): Promise<ActionResponse<{ saved: boolean }>> {

  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

 if (!validationResult || validationResult instanceof Error) {
  return handleError(validationResult || new Error("Validation failed")) as ErrorResponse;
}

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const question = await Question.findById(questionId)
    if (!question) throw new Error("Question not found");


    const collection = await Collection.findOne({ question: questionId, author: userId })
  revalidatePath(ROUTES.QUESTION(questionId));
    if (collection) {
      await Collection.findByIdAndDelete(collection.id)
      return {
        success: true,
        data: {
          saved: false,
        },
      };
    }
    await Collection.create({
      question: questionId,
      author: userId,
    })
    revalidatePath(ROUTES.QUESTION(questionId));
    return {
      success: true,
      data: {
        saved: true,
      },
    };

  } catch (error) {
    return handleError(error) as ErrorResponse;
  }

}






export async function hasSavedQuestion(
  params: CollectionBaseParams
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

 if (!validationResult || validationResult instanceof Error) {
  return handleError(validationResult || new Error("Validation failed")) as ErrorResponse;
}

  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    return {
      success: true,
      data: {
        saved: !!collection,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
