// import "use server";

import connectDB from "@/db/connectDB";

import Project from "@/db/(models)/Project";

import { ProjectDto } from "@/use-cases/project/types";

type ProjectModelType = {
  _id: string;
  name: string;
  description: string;
  members: string[];
  tasks: string[];
  team: string;
};

export function projectToProjectDto(project: ProjectModelType): ProjectDto {
  return {
    id: project._id,
    name: project.name,
    description: project.description,
    members: project.members,
    tasks: project.tasks,
    team: project.team,
  };
}

// May require refactpr to get by ID
async function getProject(projectId: string): Promise<ProjectDto> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    // Find the user by ID
    const project = await Project.findById(projectId);
    return project;
  } catch (error) {
    throw new Error("Error retrieving project:" + error);
  }
}

export default getProject;
