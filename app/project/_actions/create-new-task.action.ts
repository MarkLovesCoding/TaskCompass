"use server";
import { createNewTask } from "@/data-access/tasks/create-new-task.persistence";
import { createNewTaskUseCase } from "@/use-cases/task/create-new-task.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { revalidatePath } from "next/cache";

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
  } catch (error: any) {
    console.error(error);
  }
}
