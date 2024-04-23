import { teamToCreateTeamDto } from "@/use-cases/team/utils";
import { TeamEntity, TeamEntityValidationError } from "@/entities/Team";
import { AuthenticationError, ValidationError } from "../utils";

import type { CreateNewTeam } from "@/use-cases/team/types";
import type { GetUserSession } from "@/use-cases/user/types";

export async function createNewTeamUseCase(
  context: {
    createNewTeam: CreateNewTeam;
    getUser: GetUserSession;
  },
  data: {
    name: string;
  }
) {
  const user = context.getUser()!;
  if (!user) throw new AuthenticationError();

  try {
    const newTeam = new TeamEntity({
      name: data.name,
      users: [user.userId],
      projects: [],
      createdBy: user.userId,
      backgroundImage: "",
      backgroundImageThumbnail: "",
    });
    await context.createNewTeam(teamToCreateTeamDto(newTeam), user.userId);
  } catch (err) {
    const error = err as TeamEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
