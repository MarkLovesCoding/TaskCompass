"use server";
import { updateProjectArchivedUseCase } from "@/use-cases/project/update-project-archived.use-case";
import { updateProject } from "@/data-access/projects/update-project.persistence";
import getProject from "@/data-access/projects/get-project.persistence";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
import { ValidationError } from "@/use-cases/utils";

type Form = {
  archived: boolean;
  projectId: string;
};

export async function updateProjectArchivedAction(form: Form) {
  const { getUser } = await getUserFromSession();

  try {
    await updateProjectArchivedUseCase(
      {
        getProject,
        updateProject,
        getUser,
      },
      {
        archived: form.archived,
        projectId: form.projectId,
      }
    );
    revalidatePath(`/project/${form.projectId}`);
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
