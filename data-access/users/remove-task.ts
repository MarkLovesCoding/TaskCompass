import "server-only";

import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";

import type { TaskDto } from "@/use-cases/task/types";
import { UserDto } from "@/use-cases/user/types";

export async function removeTaskFromUser(
  task: TaskDto,
  user: UserDto
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  const taskId = task.id;
  const userId = user.id;
  try {
    await User.findOneAndUpdate({ _id: userId }, { $pull: { tasks: taskId } });
  } catch (error) {
    throw new Error("Error removing task from user:" + error);
  }
}
