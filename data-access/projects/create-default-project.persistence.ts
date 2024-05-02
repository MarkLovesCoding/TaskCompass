"use server";
import connectDB from "@/db/connectDB";
import Project from "@/db/(models)/Project";
import Team from "@/db/(models)/Team";
import User from "@/db/(models)/User";

import type { CreateProjectDto, ProjectDto } from "@/use-cases/project/types";
import { projectModelToProjectDto } from "./utils";

export async function createDefaultProject(
  project: CreateProjectDto
): Promise<ProjectDto> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  try {
    const newProject = await Project.create(project);
    const newProjectDto = projectModelToProjectDto(newProject);
    return newProjectDto;
  } catch (error) {
    throw new Error("Error creating project:" + error);
  }
}
