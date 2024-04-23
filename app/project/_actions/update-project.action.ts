"use server";
import { revalidatePath } from "next/cache";
import { updateProjectUseCase } from "@/use-cases/project/update-project.use-case";
import { updateProject } from "@/data-access/projects/update-project.persistence";
import { getUserFromSession } from "@/lib/sessionAuth";
import { ProjectDto } from "@/use-cases/project/types";
import { ValidationError } from "@/use-cases/utils";
export async function updateProjectAction(project: ProjectDto) {
  const { getUser } = await getUserFromSession();
  try {
    await updateProjectUseCase(
      {
        updateProject,
        getUser,
      },
      {
        project: project,
      }
    );

    revalidatePath(`/project/${project.id}`);
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
