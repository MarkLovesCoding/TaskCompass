import "server-only";

import connectDB from "@/db/connectDB";

import Team from "@/db/(models)/Team";
import User from "@/db/(models)/User";

import { CreateTeamDto } from "@/use-cases/team/types";

export async function createNewTeam(team: CreateTeamDto): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  try {
    const newTeam = await Team.create(team);
    const newTeamId = newTeam.id;

    await User.findByIdAndUpdate(team.members[0], {
      $push: { teams: newTeamId },
    });
    console.log("New Team Created", newTeam);
  } catch (error) {
    throw new Error(
      "Error creating team or Updating User with new team.:" + error
    );
  }
}
