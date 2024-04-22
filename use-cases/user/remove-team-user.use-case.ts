import { UserEntity } from "@/entities/User";
import { GetUser, GetUserSession, UpdateUser } from "@/use-cases/user/types";
import { userToDto } from "./utils";
import { GetTeam, UpdateTeam } from "../team/types";
import { TeamEntity } from "@/entities/Team";
import { teamToDto } from "../team/utils";
import { AuthenticationError } from "../utils";
export async function removeTeamUserUseCase(
  context: {
    getTeam: GetTeam;
    updateTeam: UpdateTeam;
    updateUser: UpdateUser;
    getUser: GetUserSession;
    getUserObject: GetUser;
  },
  data: {
    teamId: string;
    teamUserId: string;
  }
) {
  const user = context.getUser()!;
  if (!user) throw new AuthenticationError();

  const getTeam = await context.getTeam(data.teamId);
  const validatedTeam = new TeamEntity(getTeam);
  validatedTeam.removeUser(data.teamUserId);
  const updatedTeam = teamToDto(validatedTeam);

  await context.updateTeam(updatedTeam);
  const teamUser = await context.getUserObject(data.teamUserId);
  const validatedTeamUser = new UserEntity(teamUser);
  validatedTeamUser.removeTeamAsMember(data.teamId);
  validatedTeamUser.removeTeamAsAdmin(data.teamId);
  await context.updateUser(userToDto(validatedTeamUser));
}
