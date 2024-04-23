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
  if (!getTeam) throw new Error("Team not found");

  try {
    const validatedTeam = new TeamEntity(getTeam);
    validatedTeam.removeUser(data.teamUserId);
    const updatedTeam = teamToDto(validatedTeam);

    await context.updateTeam(updatedTeam);
  } catch (err) {
    const error = err as TeamEntityValidationError;
    throw new ValidationError(error.getErrors());
  }

  const teamUser = await context.getUserObject(data.teamUserId);
  if (!teamUser) throw new Error("User not found");
  try {
    const validatedTeamUser = new UserEntity(teamUser);
    validatedTeamUser.removeTeamAsMember(data.teamId);
    validatedTeamUser.removeTeamAsAdmin(data.teamId);
    await context.updateUser(userToDto(validatedTeamUser));
  } catch (err) {
    const error = err as UserEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
