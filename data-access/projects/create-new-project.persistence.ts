import "server-only";

import connectDB from "@/db/connectDB";

import Project from "@/db/(models)/Project";
import { CreateProjectDto } from "@/use-cases/project/types";
import Team from "@/db/(models)/Team";
import User from "@/db/(models)/User";

export async function createNewProject(
  project: CreateProjectDto
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  try {
    const newProject = await Project.create(project);
    console.log("New Project Created", newProject);
    await Team.findByIdAndUpdate(project.team, {
      $push: { projects: newProject.id },
    });
    await User.findByIdAndUpdate(project.users[0], {
      $push: { projects: newProject.id },
    });

    console.log("New Project Created", newProject);
  } catch (error) {
    throw new Error("Error creating project:" + error);
  }
}
