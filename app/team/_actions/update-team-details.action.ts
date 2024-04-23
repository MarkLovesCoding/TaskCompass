"use server";
import { updateTeamDetailsUseCase } from "@/use-cases/team/update-team-details.use-case";
import { updateTeam } from "@/data-access/teams/update-team.persistence";
import getTeam from "@/data-access/teams/get-team.persistence";
import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
import { ValidationError } from "@/use-cases/utils";
type Form = {
  name: string;
};

export async function updateTeamDetailsAction(form: Form, teamId: string) {
  const { getUser } = await getUserFromSession();

  try {
    await updateTeamDetailsUseCase(
      {
        getTeam,
        updateTeam,
        getUser,
      },
      {
        name: form.name,
        teamId: teamId,
      }
    );
    revalidatePath(`/team/${teamId}`);
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
