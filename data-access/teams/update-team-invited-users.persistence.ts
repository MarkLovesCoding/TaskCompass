"use server";
import connectDB from "@/db/connectDB";
import Team from "@/db/(models)/Team";
import { Resend } from "resend";

import type { TeamDto } from "@/use-cases/team/types";
import { TInviteUser } from "@/use-cases/team/types";
export async function updateTeamInvitedUsers(
  teamId: string,
  invitedUser: TInviteUser,
  updateType: "add" | "remove"
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  if (updateType === "add") {
    try {
      await Team.findByIdAndUpdate(teamId, {
        $addToSet: { invitedUsers: invitedUser },
      });
    } catch (error) {
      console.log("Error updating team object: ", error);
      throw new Error("Error updating team with inviteUserToken");
    }
  } else if (updateType === "remove") {
    try {
      await Team.findByIdAndUpdate(teamId, {
        $pull: { invitedUsers: { email: invitedUser.email } },
      });
    } catch (error) {
      console.log("Error updating team object: ", error);
      throw new Error("Error updating team with inviteUserToken");
    }
  }
}
