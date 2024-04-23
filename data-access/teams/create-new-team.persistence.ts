"use server";
import connectDB from "@/db/connectDB";
import Team from "@/db/(models)/Team";
import User from "@/db/(models)/User";

import type { CreateTeamDto } from "@/use-cases/team/types";

export async function createNewTeam(
  team: CreateTeamDto,
  userId: string
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  try {
    const newTeam = await Team.create(team);
    const newTeamId = newTeam.id;
    await User.findByIdAndUpdate(userId, {
      $push: { teamsAsAdmin: newTeamId },
    });
  } catch (error) {
    throw new Error(
      "Error creating team or Updating User with new team.:" + error
    );
  }
}
