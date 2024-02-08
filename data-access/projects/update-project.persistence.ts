import "server-only";

import connectDB from "@/db/connectDB";

import Project from "@/db/(models)/Project";

import { ProjectDto } from "@/use-cases/project/types";

// May require refactpr to get by ID
export async function updateProject(project: ProjectDto): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  const projectId = project.id;

  try {
    const newTask = await Project.findByIdAndUpdate(
      {
        _id: projectId,
      },
      {
        title: project.name,
        description: project.description,
        tasks: project.tasks,
      }
    );
    console.log("Project Updated", project);
  } catch (error) {
    throw new Error("Errorudpating project :" + error);
  }
}
