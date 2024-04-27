import { NextResponse } from "next/server";

import crypto from "crypto";
import { Resend } from "resend";

import { teamToDto } from "../team/utils";
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
} from "../team/types";
import Team from "@/db/(models)/Team";
import { updateTeamInvitedUsers } from "@/data-access/teams/update-team-invited-users.persistence";

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
    await context.getUserByEmail(inviteData.email);

    newUser: false;
  } catch (error) {
    newUser: true;
    // throw new Error("Error getting user by email");
  }
  // if (!invitee) toggle newUser boolean

  //get Team
  const getTeam = await context.getTeam(inviteData.teamId);
  if (!getTeam) throw new Error("Team not found");

  //if user does not exist, send email to join team, AND

  const teamName = getTeam.name;
  const teamId = inviteData.teamId;
  const inviterName = inviteData.inviterName;
  //update Team

  const resetToken = crypto.randomBytes(20).toString("hex");

  const inviteUserToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const inviteUserExpires = Date.now() + 3600000; // 1 hour from now
  const inviteUserObject = {
    email: inviteData.email,
    role: inviteData.role,
    newUser: newUser,
    inviteUserToken: inviteUserToken,
    inviteUserTokenExpires: Date.now() + 3600000 * 24, // 24 hours from now
  };
  // try{
  //   // updateTeamInvite()
  // }
  try {
    await context.updateTeamInvitedUsers(teamId, inviteUserObject, "add");
  } catch (error) {
    console.log("Error updating team object: ", error);
    throw new Error("Error updating team with inviteUserToken");
  }
  const resetURL = newUser
    ? "http://localhost:3000/inviteNewUser/" + teamId + "/" + resetToken
    : "http://localhost:3000/inviteUser/" + teamId + "/" + resetToken;
  const body = `${inviterName} has invited you to join their TaskCompass team: ${teamName}. Join by clicking on following link:  + ${resetURL}`;
  const msg = {
    to: inviteData.email, // Change to your recipient
    from: "no_reply@taskcompass.ca", // Change to your verified sender
    subject: `TaskCompass -- Invite to join ${inviterName}'s team: ${teamName}`,
    text: body,
  };
  const resend = new Resend(process.env.RESEND_API);

  // (async function () {
  const { data, error } = await resend.emails.send(msg);
  if (error) {
    try {
      await context.updateTeamInvitedUsers(teamId, inviteUserObject, "remove");
    } catch (error) {
      console.log("Error resetting invite tokens from team", error);
      throw new Error("Error resetting invite tokens from team");
    }

    // return NextResponse.json(
    //   { message: "Error Sending Invite Link Email", error },
    //   { status: 500 }
    // );
    throw new Error("Error Sending Invite Link Email");
  }

  // return new NextResponse("Invite User Email Sent", { status: 200 });
  // return;
}
