import { TeamEntity, TeamEntityValidationError } from "@/entities/Team";
import { GetTeam, UpdateTeam, UpdateTeamUsers } from "@/use-cases/team/types";
import { GetUserSession } from "@/use-cases/user/types";
import { teamToDto } from "@/use-cases/team/utils";
import { TeamDto } from "@/use-cases/team/types";
import { AuthenticationError, ValidationError } from "../utils";
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
    updatedTeam = teamToDto(validatedTeam);
    await context.updateTeam(updatedTeam);
  } catch (err) {
    const error = err as TeamEntityValidationError;
    throw new ValidationError(error.getErrors());
  }

  try {
    await context.updateManyTeamUsers(
      data.teamId,
      team.users,
      updatedTeam.users
    );
  } catch (err) {
    throw new Error("Failed to update team users");
  }
}
