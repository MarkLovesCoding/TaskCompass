import "server-only";

import connectDB from "@/db/connectDB";
import Task from "@/db/(models)/Task";

import type { TaskDto } from "@/use-cases/task/types";
import { UserDto } from "@/use-cases/user/types";

export async function removeUserFromTask(
  task: TaskDto,
  user: UserDto
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    const taskId = task.id;
    const userId = user.id;

    await Task.findOneAndUpdate(
      { _id: taskId },
      { $pull: { members: userId } }
    );
  } catch (error) {
    throw new Error("Error removing user from task:" + error);
  }
}
