import { TeamEntity } from "@/entities/Team";
import { UpdateTeam, GetTeam } from "@/use-cases/team/types";

import { GetUserSession } from "@/use-cases/user/types";
import { teamToDto } from "@/use-cases/team/utils";
import { AuthenticationError, ValidationError } from "../utils";
import { ProjectEntityValidationError } from "@/entities/Project";
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
