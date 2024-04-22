import { UserEntity, UserEntityValidationError } from "@/entities/User";
import {
  GetUser,
  GetUserSession,
  UpdateUser,
  User,
} from "@/use-cases/user/types";
import { userToDto } from "./utils";
import { GetTeam } from "../team/types";
import { TeamEntity } from "@/entities/Team";
import { AuthenticationError, ValidationError } from "../utils";

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
  if (!team) throw new Error("Team not found");

  try {
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
  } catch (err) {
    const error = err as UserEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
