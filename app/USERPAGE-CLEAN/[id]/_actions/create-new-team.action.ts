"use server";
import { createNewTeam } from "@/data-access/teams/create-new-team.persistence";
import { createNewTeamUseCase } from "@/use-cases/team/create-new-team.use-case";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
type Form = {
  name: string;
};

export async function createNewTeamAction(form: Form) {
  console.log("form", form);
  const { getUser } = await getUserFromSession();

  try {
    await createNewTeamUseCase(
      {
        createNewTeam,
        getUser,
      },
      {
        name: form.name,
      }
    );
    revalidatePath("/TEAMS-CLEAN/[slug]");
    return { form: { name: "" } };
  } catch (error: any) {
    console.error(error);
  }
}
