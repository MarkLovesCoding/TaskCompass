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

//explicitly convert bson objects to strings for prop injection
export function projectToProjectDto(project: ProjectModelType): ProjectDto {
  const convertedTasks =
    project.tasks.length > 0
      ? project.tasks.map((task) => task.toString())
      : [];
  const convertedMembers =
    project.members.length > 0
      ? project.members.map((member) => member.toString())
      : [];
  const convertedId = project._id.toString();
  const convertedTeam = project.team ? project.team.toString() : "";
  return {
    id: convertedId,
    name: project.name,
    description: project.description,
    members: convertedMembers,
    tasks: convertedTasks,
    team: convertedTeam,
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
    return projectToProjectDto(project);
  } catch (error) {
    throw new Error("Error retrieving project:" + error);
  }
}

export default getProject;
