"use server";
import { createNewProject } from "@/data-access/projects/create-new-project.persistence";
import { createNewProjectUseCase } from "@/use-cases/project/create-new-project.use-case";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
import { ValidationError } from "@/use-cases/utils";
type Form = {
  name: string;
  description: string;
};

export async function createNewProjectAction(form: Form, teamId: string) {
  const { getUser } = await getUserFromSession();

  try {
    await createNewProjectUseCase(
      {
        createNewProject,
        getUser,
      },
      {
        name: form.name,
        description: form.description,
        teamId: teamId,
      }
    );
    revalidatePath(`/team/${teamId}`);

    return { form: { name: "" } };
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
