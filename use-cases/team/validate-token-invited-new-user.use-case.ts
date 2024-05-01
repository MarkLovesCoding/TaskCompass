import crypto from "crypto";

import { TInvitedUser } from "@/entities/Team";
import { ValidationError } from "../utils";
import type { GetTeam } from "./types";
// import { updateTeamInvitedUsers } from "@/data-access/teams/update-team-invited-users.persistence";

//******************************************
//This function validates the invite token and sets up the user
//It also updates the team and user entities
//******************************************
export async function validateTokenInvitedNewUserUseCase(
  context: {
    getTeam: GetTeam;
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

  //Finally, return invitedUserObject to propogate data to new user sign up form for next steps.
  return invitedUser;
}
