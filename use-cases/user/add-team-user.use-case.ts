import { UserEntity } from "@/entities/User";
import { GetUser, GetUserSession, UpdateUser } from "@/use-cases/user/types";
import { userToDto } from "./utils";
import { GetTeam, UpdateTeam } from "../team/types";
import { TeamEntity } from "@/entities/Team";
import { teamToDto } from "../team/utils";

export async function addTeamUserUseCase(
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
  //update Team
  console.log("add user case");
  console.log("teamId", data.teamId);
  console.log("teamUserId", data.teamUserId);
  const getTeam = await context.getTeam(data.teamId);
  console.log("Team-got", getTeam);
  const validatedTeam = new TeamEntity(getTeam);
  console.log("validatedTeam", validatedTeam);
  validatedTeam.addUser(data.teamUserId);
  console.log("validatedTeam-added user", validatedTeam);
  const updatedTeam = teamToDto(validatedTeam);
  console.log("updatedTeam-added user", validatedTeam);
  await context.updateTeam(updatedTeam);
  console.log("---after update team await");

  //update User
  const teamUser = await context.getUserObject(data.teamUserId);
  console.log("teamUser", teamUser);
  const validatedTeamUser = new UserEntity(teamUser);
  console.log("validatedTeamUser", validatedTeamUser);
  validatedTeamUser.updateUserTeamPermissions(data.teamId, "member");
  console.log("validatedTeamUser-after update", validatedTeamUser);
  await context.updateUser(userToDto(validatedTeamUser));
  console.log("after update user await");
}
