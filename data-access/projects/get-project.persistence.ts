// import "use server";
"use server";
import connectDB from "@/db/connectDB";
import { projectModelToProjectDto } from "./utils";
import Project from "@/db/(models)/Project";

import type { ProjectDto } from "@/use-cases/project/types";

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
    console.log(">>>>>>projectId", projectId);
    const project = await Project.findById(projectId);
    return projectModelToProjectDto(project);
  } catch (error) {
    throw new Error("Error retrieving project:" + error);
  }
}

export default getProject;
