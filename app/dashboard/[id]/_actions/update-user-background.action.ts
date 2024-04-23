"use server";
import getUserObject from "@/data-access/users/get-user.persistence";
import { updateUser } from "@/data-access/users/update-user.persistence";
import { updateUserBackgroundUseCase } from "@/use-cases/user/update-user-background.use-case";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
import { ValidationError } from "@/use-cases/utils";

export async function updateUserBackgroundAction(
  userId: string,
  backgroundImage: string
) {
  const { getUser } = await getUserFromSession();
  try {
    await updateUserBackgroundUseCase(
      {
        updateUser,
        getUser,
        getUserObject,
      },
      {
        userId: userId,
        backgroundImage: backgroundImage,
      }
    );
    revalidatePath(`/dashboard/${userId}/page`);

    return { success: true };
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
