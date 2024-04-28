import { NextResponse } from "next/server";

import crypto from "crypto";
import { Resend } from "resend";

import { teamToDto } from "./utils";
import { UserEntity, UserEntityValidationError } from "@/entities/User";
import { TeamEntity, TeamEntityValidationError } from "@/entities/Team";
import { AuthenticationError, ValidationError } from "../utils";
import type {
  GetUserByEmail,
  GetUserSession,
  UpdateUser,
  UserDto,
} from "@/use-cases/user/types";
import type {
  GetTeam,
  TeamDto,
  UpdateTeam,
  UpdateTeamInvitedUsers,
} from "./types";
import Team from "@/db/(models)/Team";
import { updateTeamInvitedUsers } from "@/data-access/teams/update-team-invited-users.persistence";
import { userToDto } from "../user/utils";

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
  //get user by email

  // if (!invitee) toggle newUser boolean

  //get Team
  const getTeam = await context.getTeam(inviteData.teamId);
  console.log("getTeam", getTeam);
  if (!getTeam) throw new Error("Team not found");

  //if user does not exist, send email to join team, AND

  const teamName = getTeam.name;
  const teamId = inviteData.teamId;
  //update Team
  console.log("inviteData.inviteToken", inviteData.inviteToken);

  const hashedToken = crypto
    .createHash("sha256")
    .update(inviteData.inviteToken)
    .digest("hex");
  console.log("hashedToken", hashedToken);
  const invitedUser = getTeam.invitedUsers?.find(
    (invitedUser) =>
      invitedUser.inviteUserToken === hashedToken &&
      invitedUser.inviteUserTokenExpires > Date.now()
  );

  invitedUser && updateTeamInvitedUsers(teamId, invitedUser, "remove");
  if (!invitedUser) {
    throw new ValidationError({ error: "Invalid or expired invite token" });
  }

  // filter out the invited user from the invitedUsers array
  const invitedUsersWithCurrentInviteRemoved = getTeam.invitedUsers?.filter(
    (invitedUser) => invitedUser.email !== invitedUser.email
  );

  try {
    await context.updateTeam({
      ...getTeam,
      users: [...getTeam.users],
      invitedUsers: [
        ...(invitedUsersWithCurrentInviteRemoved || [...getTeam.invitedUsers!]),
      ],
    });
  } catch (error) {
    throw new Error("Error updating team");
  }
  try {
    const retrievedUser = await context.getUserByEmail(invitedUser.email);

    const userEntity = new UserEntity(retrievedUser);
    if (invitedUser.role === "admin") {
      userEntity.addTeamAsAdmin(teamId);
    } else if (invitedUser.role === "member") {
      userEntity.addTeamAsMember(teamId);
    }
    try {
      await context.updateUser(userToDto(userEntity));
      return teamName;
    } catch (error) {
      throw new Error("Error updating user");
    }
  } catch (error) {
    throw new Error("Error retrieving user");
  }
}
