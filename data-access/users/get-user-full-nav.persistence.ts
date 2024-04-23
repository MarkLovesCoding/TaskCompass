"use server";

import connectDB from "@/db/connectDB";
import { userModelToUserDto } from "./utils";
import { projectModelToProjectDto } from "../projects/utils";
import { teamModelToTeamDto } from "../teams/utils";
import User from "@/db/(models)/User";
import Project from "@/db/(models)/Project";
import Team from "@/db/(models)/Team";

import type { ProjectDto } from "@/use-cases/project/types";
import type { TeamDto } from "@/use-cases/team/types";

type UserDataForNavType = {
  projects: ProjectDto[];
  teams: TeamDto[];
};
async function getUserProjectsAndTeams(
  userId: string
): Promise<UserDataForNavType> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    const userData = await User.findById(userId);
    const validatedUserData = userModelToUserDto(userData);
    const projects = [
      ...validatedUserData.projectsAsAdmin,
      ...validatedUserData.projectsAsMember,
    ];
    const teams = [
      ...validatedUserData.teamsAsAdmin,
      ...validatedUserData.teamsAsMember,
    ];
    const userProjects: ProjectDto[] = [];
    const userTeams: TeamDto[] = [];
    for (let projectId of projects) {
      const project = await Project.findById(projectId);
      userProjects.push(projectModelToProjectDto(project));
    }
    for (let teamId of teams) {
      const team = await Team.findById(teamId);
      userTeams.push(teamModelToTeamDto(team));
    }
    return { projects: userProjects, teams: userTeams };
  } catch (error) {
    throw new Error("Error retrieving user:" + error);
  }
}

export default getUserProjectsAndTeams;
