import { teamToDto } from "@/use-cases/team/utils";
import { TeamEntity } from "@/entities/Team";
import { ProjectEntityValidationError } from "@/entities/Project";
import { AuthenticationError, ValidationError } from "../utils";

import type { GetUserSession } from "@/use-cases/user/types";
import type { UpdateTeam, GetTeam } from "@/use-cases/team/types";

export async function updateTeamBackgroundUseCase(
  context: {
    updateTeam: UpdateTeam;
    getTeam: GetTeam;
    getUser: GetUserSession;
  },
  data: {
    teamId: string;
    backgroundImage: string;
    backgroundImageThumbnail: string;
  }
) {
  const user = context.getUser();
  if (!user) throw new AuthenticationError();

  const team = await context.getTeam(data.teamId);
  if (!team) throw new Error("Team not found");

  try {
    const validatedTeam = new TeamEntity(team);
    validatedTeam.updateBackgroundImage(data.backgroundImage);
    validatedTeam.updateBackgroundImageThumbnail(data.backgroundImageThumbnail);

    await context.updateTeam(teamToDto(validatedTeam));
  } catch (err) {
    const error = err as ProjectEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
