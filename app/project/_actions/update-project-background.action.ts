"use server";
import { updateProject } from "@/data-access/projects/update-project.persistence";
import getProject from "@/data-access/projects/get-project.persistence";
import { revalidatePath } from "next/cache";
import { updateProjectBackgroundUseCase } from "@/use-cases/project/update-project-background.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { ValidationError } from "@/use-cases/utils";
export async function updateProjectBackgroundAction(
  projectId: string,
  projectBackgroundImage: string,
  projectBackgroundImageThumbnail: string
) {
  const { getUser } = await getUserFromSession();
  try {
    await updateProjectBackgroundUseCase(
      {
        updateProject,
        getProject,
        getUser,
      },
      {
        projectId: projectId,
        projectBackgroundImage: projectBackgroundImage,
        projectBackgroundImageThumbnail: projectBackgroundImageThumbnail,
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
