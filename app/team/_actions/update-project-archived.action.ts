"use server";
import { updateProjectArchivedUseCase } from "@/use-cases/project/update-project-archived.use-case";
import { updateProject } from "@/data-access/projects/update-project.persistence";
import getProject from "@/data-access/projects/get-project.persistence";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";

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
    revalidatePath("/PROJECTS-CLEAN/[slug]/page");
  } catch (error: any) {
    console.error(error);
  }
}
