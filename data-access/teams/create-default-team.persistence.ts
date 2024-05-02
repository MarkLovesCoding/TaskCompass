"use server";
import connectDB from "@/db/connectDB";
import Team from "@/db/(models)/Team";
import User from "@/db/(models)/User";

import type { CreateTeamDto, TeamDto } from "@/use-cases/team/types";
import { TeamModelType } from "./types";
import { teamModelToTeamDto } from "./utils";

export async function createDefaultTeam(team: CreateTeamDto): Promise<TeamDto> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  try {
    const newTeam = await Team.create(team);
    const newTeamDto = teamModelToTeamDto(newTeam);
    return newTeamDto;
  } catch (error) {
    throw new Error(
      "Error creating team or Updating User with new team.:" + error
    );
  }
}
