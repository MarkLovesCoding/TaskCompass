import { userToDto } from "./utils";
import { teamToDto } from "../team/utils";
import { UserEntity, UserEntityValidationError } from "@/entities/User";
import { TeamEntity, TeamEntityValidationError } from "@/entities/Team";
import { AuthenticationError, ValidationError } from "../utils";

import type {
  GetUser,
  GetUserSession,
  UpdateUser,
} from "@/use-cases/user/types";
import type { GetTeam, UpdateTeam } from "../team/types";

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
  const user = context.getUser()!;
  if (!user) throw new AuthenticationError();
  //update Team
  const getTeam = await context.getTeam(data.teamId);
  if (!getTeam) throw new Error("Team not found");

  try {
    const validatedTeam = new TeamEntity(getTeam);
    validatedTeam.addUser(data.teamUserId);
    const updatedTeam = teamToDto(validatedTeam);
    await context.updateTeam(updatedTeam);
  } catch (err) {
    const error = err as TeamEntityValidationError;
    throw new ValidationError(error.getErrors());
  }

  //update User
  try {
    const teamUser = await context.getUserObject(data.teamUserId);
    const validatedTeamUser = new UserEntity(teamUser);
    validatedTeamUser.updateUserTeamPermissions(data.teamId, "member");
    await context.updateUser(userToDto(validatedTeamUser));
  } catch (err) {
    const error = err as UserEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
