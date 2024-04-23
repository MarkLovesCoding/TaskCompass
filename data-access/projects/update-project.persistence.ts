"use server";
import connectDB from "@/db/connectDB";
import Project from "@/db/(models)/Project";

import type { ProjectDto } from "@/use-cases/project/types";

export async function updateProject(project: ProjectDto): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  const projectId = project.id;

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      {
        _id: projectId,
      },
      { ...project },
      { new: true }
    );
  } catch (error) {
    throw new Error("Error updating project :" + error);
  }
}
