import Interaction, { IInteraction } from '@/database/interaction.model';
import User from '@/database/user.model';
import mongoose from "mongoose";
import action from '../handlers/actions';
import handleError from '../handlers/error';
import dbConnect from '../mongoose';
import { CreateInteractionSchema } from '../validations';

export async function createInteraction(params: CreateInteractionParams): Promise<ActionResponse<IInteraction>> {

  const ValidationResult = await action({
    params,
    schema: CreateInteractionSchema,
    authorize: true,
  })

  if (ValidationResult instanceof Error || !ValidationResult?.params || !ValidationResult.session?.user?.id) {
    return handleError(ValidationResult || new Error("Validation failed")) as ErrorResponse;
  }
  const { action: actionType, actionId, authorId, actionTarget } = ValidationResult.params;

  const userId = ValidationResult.session.user.id;

  const connection = await dbConnect();
  const session = await connection.startSession();
  session.startTransaction();


  try {
    const [interaction] = await Interaction.create([
      {
        user: userId,
        action: actionType,
        actionId: new mongoose.Types.ObjectId(actionId),
        actionType: actionTarget,
      }
    ],

      { session });

    await updateReputation({
      interaction,
      session,
      authorId,
      performerId: userId!,
    },

    )

    await session.commitTransaction();

    return { success: true, data: JSON.parse(JSON.stringify(interaction)) };

  } catch (error) {
    await session.abortTransaction();
    return handleError(error as Error) as ErrorResponse;
  } finally {
    await session.endSession();
  }








}


async function updateReputation(params: UpdateReputationParams,) {

  const { interaction, session, performerId, authorId } = params;
  const { action, actionType } = interaction;
  let performerPoints = 0;
  let authorPoints = 0;
  switch (action) {
    case "upvote": performerPoints = 3; authorPoints = 10; break;
    case "downvote": performerPoints = -1; authorPoints = -2; break;

    case "post": authorPoints = actionType === "question" ? 5 : 10; break;
    case "delete": authorPoints = actionType === "question" ? -5 : -10; break;
    default: break;
  }

  if (performerId === authorId) {

    await User.findByIdAndUpdate(performerId, {
      $inc: { reputation: authorPoints }
    },
      { session }
    )
    return
  }

  await User.bulkWrite(
    [
      {
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(performerId) },
          update: { $inc: { reputation: performerPoints } },
        },
      },

      {
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(authorId) },
          update: { $inc: { reputation: authorPoints } },
        },



      }], { session })

}
