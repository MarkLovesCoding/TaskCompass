import "server-only";

import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";

import type { ProjectDto } from "@/use-cases/project/types";
import { UserDto } from "@/use-cases/user/types";

export async function addProjectToUser(
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
    await User.findOneAndUpdate(
      { _id: userId },
      { $push: { projects: projectId } }
    );
  } catch (error) {
    throw new Error("Error updating user:" + error);
  }
}
