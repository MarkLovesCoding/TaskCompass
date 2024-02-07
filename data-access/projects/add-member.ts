import "server-only";

import connectDB from "@/db/connectDB";
import Project from "@/db/(models)/Project";

import type { ProjectDto } from "@/use-cases/project/types";
import { UserDto } from "@/use-cases/user/types";

export async function addMemberToProject(
  project: ProjectDto,
  user: UserDto
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  const projectId = project.id;
  const userId = user.id;
  try {
    await Project.findOneAndUpdate(
      { _id: projectId },
      { $push: { members: userId } }
    );
  } catch (error) {
    throw new Error("Error adding member to project:" + error);
  }
}
