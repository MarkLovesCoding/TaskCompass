import { TeamEntity } from "@/entities/Team";
import { GetTeam, UpdateTeam, UpdateTeamUsers } from "@/use-cases/team/types";
import { GetUserSession } from "@/use-cases/user/types";
import { teamToDto } from "@/use-cases/team/utils";
import { AuthenticationError } from "../utils";

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

  const validatedTeam = new TeamEntity(team);
  validatedTeam.updateUsers(data.updatedUsers);
  const updatedTeam = teamToDto(validatedTeam);
  await context.updateTeam(updatedTeam);

  await context.updateManyTeamUsers(data.teamId, team.users, updatedTeam.users);
}
