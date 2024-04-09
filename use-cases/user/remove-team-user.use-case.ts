import { UserEntity } from "@/entities/User";
import { GetUser, GetUserSession, UpdateUser } from "@/use-cases/user/types";
import { userToDto } from "./utils";
import { GetTeam, UpdateTeam } from "../team/types";
import { TeamEntity } from "@/entities/Team";
import { teamToDto } from "../team/utils";

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
  const { userId } = context.getUser()!;
  if (!userId) throw new Error("User not found");
  console.log("get Team");

  const getTeam = await context.getTeam(data.teamId);
  const validatedTeam = new TeamEntity(getTeam);
  console.log("validatedTeam", validatedTeam);
  validatedTeam.removeUser(data.teamUserId);
  console.log("validatedTeam-removed user", validatedTeam);

  const updatedTeam = teamToDto(validatedTeam);
  console.log("updatedTeam-removed user", validatedTeam);

  await context.updateTeam(updatedTeam);
  console.log("---after update team await");
  const teamUser = await context.getUserObject(data.teamUserId);
  console.log("teamUser", teamUser);
  const validatedTeamUser = new UserEntity(teamUser);
  console.log("validatedTeamUser", validatedTeamUser);
  validatedTeamUser.removeTeamAsMember(data.teamId);
  validatedTeamUser.removeTeamAsAdmin(data.teamId);
  console.log("validatedTeamUser-after remove", validatedTeamUser);
  await context.updateUser(userToDto(validatedTeamUser));
  console.log("after update user await");
}
