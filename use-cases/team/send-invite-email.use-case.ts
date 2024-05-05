import crypto from "crypto";
import { Resend } from "resend";

import { AuthenticationError } from "../utils";

import type { GetUserByEmail, GetUserSession } from "@/use-cases/user/types";
import type {
  GetTeam,
  UpdateTeam,
  UpdateTeamInvitedUsers,
} from "../team/types";

export async function sendInviteEmailUseCase(
  context: {
    getUserByEmail: GetUserByEmail;
    getTeam: GetTeam;
    updateTeam: UpdateTeam;
    getUser: GetUserSession;
    updateTeamInvitedUsers: UpdateTeamInvitedUsers;
  },
  inviteData: {
    email: string;
    role: "member" | "admin";
    teamId: string;
    inviterName: string;
  }
) {
  const user = context.getUser()!;
  if (!user) throw new AuthenticationError();
  let newUser = true;

  //get user by email
  try {
    const retrievedUser = await context.getUserByEmail(inviteData.email);
    newUser = false;
  } catch (error) {
    newUser = true;
  }
  //get Team
  const getTeam = await context.getTeam(inviteData.teamId);
  if (!getTeam) throw new Error("Team not found");

  const teamName = getTeam.name;
  const teamId = inviteData.teamId;
  const inviterName = inviteData.inviterName;

  const resetToken = crypto.randomBytes(20).toString("hex");
  const inviteUserToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const inviteUserObject = {
    email: inviteData.email,
    role: inviteData.role,
    teamId: inviteData.teamId,
    inviteUserToken: inviteUserToken,
    inviteUserTokenExpires: Date.now() + 3600000 * 24, // 24 hours from now
  };

  try {
    await context.updateTeamInvitedUsers(teamId, inviteUserObject, "add");
  } catch (error) {
    console.log("Error updating team object: ", error);
    throw new Error("Error updating team with inviteUserToken");
  }
  const environment = process.env.ENVIRONMENT;
  const uri =
    environment === "development"
      ? process.env.DEVELOPMENT_URI
      : process.env.PRODUCTION_URI;

  const resetURL =
    newUser === true
      ? `${uri}/registration/invitedNewToTeam/` + teamId + "/" + resetToken
      : `${uri}/registration/invitedToTeam/` + teamId + "/" + resetToken;
  const body = `${inviterName} has invited you to join their TaskCompass team: ${teamName}. Join by clicking on following link: ${resetURL}`;
  const msg = {
    to: inviteData.email, // Change to your recipient
    from: "no_reply@taskcompass.ca", // Change to your verified sender
    subject: `TaskCompass -- Invite to join ${inviterName}'s team: ${teamName}`,
    text: body,
  };
  const resend = new Resend(process.env.RESEND_API);

  const { data, error } = await resend.emails.send(msg);
  if (error) {
    try {
      await context.updateTeamInvitedUsers(teamId, inviteUserObject, "remove");
    } catch (error) {
      console.log("Error resetting invite tokens from team", error);
      throw new Error("Error resetting invite tokens from team");
    }

    throw new Error("Error Sending Invite Link Email");
  }
}
