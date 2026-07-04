import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";



import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";

export async function POST(request: Request) {
  let mongoSession: mongoose.ClientSession | null = null;

  try {
    const { provider, providerAccountId, user } = await request.json();

    await dbConnect();

    mongoSession = await mongoose.startSession();
    mongoSession.startTransaction();

    const validatedData = SignInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const { name, username, email, image } = user;

    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    let existingUser = await User.findOne({ email }).session(mongoSession);

    if (!existingUser) {
      [existingUser] = await User.create(
        [{ name, username: slugifiedUsername, email, image }],
        { session: mongoSession }
      );
    } else {
      const updatedData: { name?: string; image?: string } = {};

      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;

      if (Object.keys(updatedData).length > 0) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updatedData }
        ).session(mongoSession);
      }
    }

    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(mongoSession);

    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id,
            name,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session: mongoSession }
      );
    }

    await mongoSession.commitTransaction();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (mongoSession) {
      try {
        await mongoSession.abortTransaction();
      } catch {
        // ignore abort errors from an unstarted or already-finished transaction
      }
    }

    return handleError(error, "api") as APIErrorResponse;
  } finally {
    if (mongoSession) {
      mongoSession.endSession();
    }
  }
}
