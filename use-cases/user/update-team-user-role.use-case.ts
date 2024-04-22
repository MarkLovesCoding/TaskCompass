import { UserEntity } from "@/entities/User";
import { GetUser, GetUserSession, UpdateUser } from "@/use-cases/user/types";
import { userToDto } from "./utils";
import { GetTeam } from "../team/types";
import { TeamEntity } from "@/entities/Team";
import { AuthenticationError } from "../utils";

export async function updateTeamUserRoleUseCase(
  context: {
    getTeam: GetTeam;
    updateUser: UpdateUser;
    getUser: GetUserSession;
    getUserObject: GetUser;
  },
  data: {
    teamId: string;
    updateType: "admin" | "member";
    teamUserId: string;
  }
) {
  const user = context.getUser()!;
  if (!user) throw new AuthenticationError();

  const team = await context.getTeam(data.teamId);
  const validatedTeam = new TeamEntity(team);
  const teamCreatedBy = validatedTeam.getCreatedBy();
  if (teamCreatedBy == data.teamUserId)
    //figure out how to transfer this to toast
    throw new Error("Team Creator can't be changed");
  else {
    const teamUser = await context.getUserObject(data.teamUserId);
    const validatedTeamUser = new UserEntity(teamUser);
    validatedTeamUser.updateUserTeamPermissions(data.teamId, data.updateType);
    await context.updateUser(userToDto(validatedTeamUser));
  }
}
