import "server-only";

import connectDB from "@/db/connectDB";

import Task from "@/db/(models)/Task";
import User from "@/db/(models)/User";
import { TaskDto } from "@/use-cases/task/types";

export async function updateTaskFullCard(
  task: TaskDto,
  removedAssignees: string[],
  addedAssignees: string[]
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  try {
    const taskToBeUpdated = await Task.findByIdAndUpdate(task.id, task);

    if (addedAssignees.length > 0) {
      addedAssignees.forEach(async (userId) => {
        await User.findByIdAndUpdate(userId, { $push: { tasks: task.id } });
      });
    }
    if (removedAssignees.length > 0) {
      removedAssignees.forEach(async (userId) => {
        await User.findByIdAndUpdate(userId, { $pull: { tasks: task.id } });
      });
    }
  } catch (error) {
    throw new Error("Error creating project:" + error);
  }
}
