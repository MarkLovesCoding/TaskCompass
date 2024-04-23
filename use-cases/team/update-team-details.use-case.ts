import { teamToDto } from "@/use-cases/team/utils";
import { TeamEntity, TeamEntityValidationError } from "@/entities/Team";
import { AuthenticationError, ValidationError } from "../utils";

import type { GetUserSession } from "@/use-cases/user/types";
import type { UpdateTeam, GetTeam } from "@/use-cases/team/types";

export async function updateTeamDetailsUseCase(
  context: {
    updateTeam: UpdateTeam;
    getTeam: GetTeam;
    getUser: GetUserSession;
  },
  data: {
    name: string;
    teamId: string;
  }
) {
  const user = context.getUser();
  if (!user) throw new AuthenticationError();

  const team = await context.getTeam(data.teamId);
  if (!team) throw new Error("Team not found");

  try {
    const validatedTeam = new TeamEntity(team);
    validatedTeam.updateName(data.name);
    await context.updateTeam(teamToDto(validatedTeam));
  } catch (err) {
    const error = err as TeamEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
