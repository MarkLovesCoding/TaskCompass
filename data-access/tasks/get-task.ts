import "server-only";

import connectDB from "@/db/connectDB";

import Task from "@/db/(models)/Task";

import { TaskDto } from "@/use-cases/task/types";

// May require refactpr to get by ID
async function getTask(task: TaskDto): Promise<TaskDto> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  const taskId = task.id;
  try {
    // Find the user by ID
    const task = await Task.findById(taskId);
    return task;
  } catch (error) {
    throw new Error("Error retrieving task:" + error);
  }
}

export default getTask;
