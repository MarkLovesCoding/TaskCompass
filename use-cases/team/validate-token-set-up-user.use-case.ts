import crypto from "crypto";

import { teamToDto } from "./utils";
import { UserEntity } from "@/entities/User";
import { TInvitedUser, TeamEntity } from "@/entities/Team";
import { ValidationError } from "../utils";
import type { GetUserByEmail, UpdateUser } from "@/use-cases/user/types";
import type { GetTeam, UpdateTeam } from "./types";
import { userToDto } from "../user/utils";

//******************************************
//This function validates the invite token and sets up the user
//It also updates the team and user entities
//******************************************
export async function validateTokenSetUpUserUseCase(
  context: {
    getTeam: GetTeam;
    updateTeam: UpdateTeam;
    getUserByEmail: GetUserByEmail;
    updateUser: UpdateUser;
  },
  inviteData: {
    teamId: string;
    inviteToken: string;
  }
) {
  //****************************************
  // Check if team exists
  // Retrieve Team Entity & Gather Team and Invite Data
  //
  const getTeam = await context.getTeam(inviteData.teamId);
  if (!getTeam) throw new Error("Team not found");

  const teamName = getTeam.name;
  const teamId = inviteData.teamId;

  //****************************************
  // Unencyrpt the invite token and compare it to the hashed token
  // Check validity of the invite token
  const hashedToken = crypto
    .createHash("sha256")
    .update(inviteData.inviteToken)
    .digest("hex");
  const invitedUser: TInvitedUser | undefined = getTeam.invitedUsers?.find(
    (invitedUser) =>
      invitedUser.inviteUserToken === hashedToken &&
      invitedUser.inviteUserTokenExpires > Date.now()
  );

  //****************************************
  // Handle case where InvitedUser doesn't exist
  if (!invitedUser) {
    throw new ValidationError({ error: "Invalid or expired invite token" });
  }

  //****************************************
  // Handle User Entity
  const retrievedUser = await context.getUserByEmail(invitedUser.email);
  if (!retrievedUser) throw new Error("Error getting user by email");

  const userEntity = new UserEntity(retrievedUser);
  if (invitedUser.role === "admin") {
    userEntity.addTeamAsAdmin(teamId);
  } else if (invitedUser.role === "member") {
    userEntity.addTeamAsMember(teamId);
  }

  //****************************************
  // Handle Update User Entity
  try {
    await context.updateUser(userToDto(userEntity));
  } catch (error) {
    throw new Error("Error updating user");
  }

  //****************************************
  // Handle Update Team Entity
  const teamEntity = new TeamEntity(getTeam);
  teamEntity.addUser(retrievedUser.id);
  teamEntity.removeInvitedUser(invitedUser);

  try {
    await context.updateTeam(teamToDto(teamEntity));
  } catch (error) {
    throw new Error("Error updating team");
  }

  //Finally, return teamName to propogate data to the front-end
  return teamName;
}
