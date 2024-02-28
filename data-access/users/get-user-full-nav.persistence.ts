"use server";

import connectDB from "@/db/connectDB";

import User from "@/db/(models)/User";
import Project from "@/db/(models)/Project";
import Team from "@/db/(models)/Team";
import { UserDto } from "@/use-cases/user/types";
import { ProjectDto } from "@/use-cases/project/types";
import { userModelToUserDto } from "./utils";

import { projectModelToProjectDto } from "../projects/utils";
import { teamModelToTeamDto } from "../teams/utils";
import { TeamDto } from "@/use-cases/team/types";

// May require refactpr to get by ID
type UserDataForNavType = {
  projects: ProjectDto[];
  teams: TeamDto[];
};
async function getUserNavObject(userId: string): Promise<UserDataForNavType> {
  // console.log("asdfasdfasfdasdf>>>>>>>>>>>>getUserObject userId", userId);
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  // const userId = user.id;
  try {
    // Find the user by ID
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

export default getUserNavObject;
