import "server-only";

import connectDB from "@/db/connectDB";

import Project from "@/db/(models)/Project";

import type { ProjectDto } from "@/use-cases/project/types";
import type { UserDto } from "@/use-cases/user/types";
import { projectToProjectDto } from "./get-project";
// May require refactpr to get by ID
async function getUserProjects(user: UserDto): Promise<ProjectDto[]> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  // const teamId = team.id;
  const projectIds = user.projects;
  const projects: ProjectDto[] = [];
  try {
    // Find the user by ID
    for (let projectId of projectIds) {
      const project = await Project.findById(projectId);
      projects.push(projectToProjectDto(project));
    }
  } catch (error) {
    throw new Error("Error retrieving team:" + error);
  }
  return projects;
}

export default getUserProjects;