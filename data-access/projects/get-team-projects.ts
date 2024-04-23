"use server";
import connectDB from "@/db/connectDB";
import { projectModelToProjectDto } from "./utils";
import Project from "@/db/(models)/Project";

import type { ProjectDto } from "@/use-cases/project/types";
import type { TeamDto } from "@/use-cases/team/types";

async function getTeamProjects(team: TeamDto): Promise<ProjectDto[]> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  const projectIds = team.projects;
  const projects: ProjectDto[] = [];
  try {
    // Find the user by ID
    for (let projectId of projectIds) {
      const project = await Project.findById(projectId);
      projects.push(projectModelToProjectDto(project));
    }
  } catch (error) {
    throw new Error("Error retrieving team:" + error);
  }
  return projects;
}

export default getTeamProjects;
