"use server";
import connectDB from "@/db/connectDB";
import Project from "@/db/(models)/Project";
import Team from "@/db/(models)/Team";
import User from "@/db/(models)/User";

import type { CreateProjectDto } from "@/use-cases/project/types";

export async function createNewProject(
  project: CreateProjectDto,
  user: string
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  try {
    const newProject = await Project.create(project);
    await Team.findByIdAndUpdate(project.team, {
      $push: { projects: newProject.id },
    });
    await User.findByIdAndUpdate(user, {
      $push: { projectsAsAdmin: newProject.id },
    });
  } catch (error) {
    throw new Error("Error creating project:" + error);
  }
}
