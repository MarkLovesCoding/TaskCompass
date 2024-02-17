"use server";
import { updateTeamDetailsUseCase } from "@/use-cases/team/update-team-details.use-case";

import { updateTeam } from "@/data-access/teams/update-team.persistence";
import getTeam from "@/data-access/teams/get-team.persistence";

import { revalidatePath } from "next/cache";
import { getUserFromSession } from "@/lib/sessionAuth";
type Form = {
  name: string;
};

export async function updateTeamDetailsAction(form: Form, teamId: string) {
  console.log("_____________________________________form", form);
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
    revalidatePath(`/TEAMS-CLEAN/${teamId}`);
  } catch (error: any) {
    console.error(error);
  }
}
