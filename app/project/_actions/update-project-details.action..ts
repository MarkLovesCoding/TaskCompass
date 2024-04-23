"use server";
import { updateProjectDetailsUseCase } from "@/use-cases/project/update-project-details.use-case";

import { updateProject } from "@/data-access/projects/update-project.persistence";
import getProject from "@/data-access/projects/get-project.persistence";

import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
import { ValidationError } from "@/use-cases/utils";
type Form = {
  name: string;
  description: string;
};

export async function updateProjectDetailsAction(
  form: Form,
  projectId: string
) {
  const { getUser } = await getUserFromSession();

  try {
    await updateProjectDetailsUseCase(
      {
        getProject,
        updateProject,
        getUser,
      },
      {
        name: form.name,
        description: form.description,
        projectId: projectId,
      }
    );
    revalidatePath(`/project/${projectId}`);
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
