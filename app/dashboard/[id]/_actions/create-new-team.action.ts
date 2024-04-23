"use server";
import { createNewTeam } from "@/data-access/teams/create-new-team.persistence";
import { createNewTeamUseCase } from "@/use-cases/team/create-new-team.use-case";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
import { ValidationError } from "@/use-cases/utils";
type Form = {
  name: string;
};

export async function createNewTeamAction(form: Form) {
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
    revalidatePath("/dashboard/[slug]");
    // return { status: "success" };
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
