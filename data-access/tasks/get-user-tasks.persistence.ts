"use server";
import connectDB from "@/db/connectDB";
import { taskModelToTaskDto } from "./utils";
import Task from "@/db/(models)/Task";

import type { UserDto } from "@/use-cases/user/types";
import type { TaskDto } from "@/use-cases/task/types";

async function getUserTasks(user: UserDto): Promise<TaskDto[]> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  const taskIds = user.tasks;

  const tasks: TaskDto[] = [];
  try {
    // Find the user by ID
    for (let taskId of taskIds) {
      const task = await Task.findById(taskId);

      tasks.push(taskModelToTaskDto(task));
    }
  } catch (error) {
    throw new Error("Error retrieving user's tasks:" + error);
  }
  return tasks;
}

export default getUserTasks;
