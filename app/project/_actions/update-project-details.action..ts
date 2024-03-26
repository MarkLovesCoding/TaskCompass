"use server";
import { updateProjectDetailsUseCase } from "@/use-cases/project/update-project-details.use-case";

import { updateProject } from "@/data-access/projects/update-project.persistence";
import getProject from "@/data-access/projects/get-project.persistence";

import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
type Form = {
  name: string;
  description: string;
};

export async function updateProjectDetailsAction(
  form: Form,
  projectId: string
) {
  console.log("_____________________________________form", form);
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
    revalidatePath("/PROJECTS-CLEAN/[slug]");
  } catch (error: any) {
    console.error(error);
  }
}
