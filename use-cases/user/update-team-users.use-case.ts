import { teamToDto } from "@/use-cases/team/utils";
import { TeamEntity, TeamEntityValidationError } from "@/entities/Team";
import { AuthenticationError, ValidationError } from "../utils";

import type {
  GetTeam,
  TeamDto,
  UpdateTeam,
  UpdateTeamUsers,
} from "@/use-cases/team/types";
import type { GetUserSession } from "@/use-cases/user/types";

export async function updateTeamUsersUseCase(
  context: {
    updateTeam: UpdateTeam;
    updateManyTeamUsers: UpdateTeamUsers;
    getTeam: GetTeam;
    getUser: GetUserSession;
  },
  data: {
    teamId: string;
    updatedUsers: string[];
  }
) {
  const user = context.getUser()!;
  if (!user) throw new AuthenticationError();

  const team = await context.getTeam(data.teamId);
  if (!team) throw new Error("Team not found");
  let updatedTeam: TeamDto;
  try {
    const validatedTeam = new TeamEntity(team);
    validatedTeam.updateUsers(data.updatedUsers);
    const updatedTeam = teamToDto(validatedTeam);
    await context.updateTeam(updatedTeam);
    try {
      await context.updateManyTeamUsers(
        data.teamId,
        team.users,
        updatedTeam.users
      );
    } catch (err) {
      throw new Error("Error updating team users");
    }
  } catch (err) {
    const error = err as TeamEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
