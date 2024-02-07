import "server-only";

import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";

import type { ProjectDto } from "@/use-cases/project/types";
import { UserDto } from "@/use-cases/user/types";

export async function removeProjectFromUser(
  project: ProjectDto,
  user: UserDto
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw error;
  }

  try {
    const projectId = project.id;
    const userId = user.id;

    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { projects: projectId } }
    );
  } catch (error) {
    // Handle User.findOneAndUpdate error
    throw error;
  }
}
