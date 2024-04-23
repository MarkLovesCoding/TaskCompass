"use server";
import { revalidatePath } from "next/cache";

import { getUserFromSession } from "@/lib/sessionAuth";
import { createNewTask } from "@/data-access/tasks/create-new-task.persistence";
import { createNewTaskUseCase } from "@/use-cases/task/create-new-task.use-case";
import { ValidationError } from "@/use-cases/utils";

type FormData = {
  name: string;
  project: string;
};

export async function createNewTaskAction(formData: FormData) {
  console.log("formData", formData);
  const { getUser } = await getUserFromSession();

  try {
    await createNewTaskUseCase(
      {
        createNewTask,
        getUser,
      },
      {
        name: formData.name,
        project: formData.project,
      }
    );
    revalidatePath(`/project/[slug]`);
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
