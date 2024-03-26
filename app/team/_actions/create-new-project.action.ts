"use server";
import { createNewProject } from "@/data-access/projects/create-new-project.persistence";
import { createNewProjectUseCase } from "@/use-cases/project/create-new-project.use-case";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
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
    revalidatePath("/TEAMS-CLEAN/[slug]/page");
    return { form: { name: "" } };
  } catch (error: any) {
    console.error(error);
  }
}
