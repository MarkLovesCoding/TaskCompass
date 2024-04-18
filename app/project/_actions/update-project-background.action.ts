"use server";
import { updateProject } from "@/data-access/projects/update-project.persistence";
import getProject from "@/data-access/projects/get-project.persistence";
import { revalidatePath } from "next/cache";
import { updateProjectBackgroundUseCase } from "@/use-cases/project/update-project-background.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
export async function updateProjectBackgroundAction(
  projectId: string,
  projectBackgroundImage: string,
  projectBackgroundImageThumb: string
) {
  const { getUser } = await getUserFromSession();
  console.log("updateProjectBackground", projectId, projectBackgroundImage);
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
        projectBackgroundImageThumb: projectBackgroundImageThumb,
      }
    );
    revalidatePath(`/project/${projectId}`);

    //for toasts, not yet implemented
    return { success: true };
  } catch (error: any) {
    console.error(error);
  }
}
