import "server-only";

import connectDB from "@/db/connectDB";

import Task from "@/db/(models)/Task";

import { TaskDto } from "@/use-cases/task/types";
import { taskModelToTaskDto } from "./utils";

// May require refactpr to get by ID
async function getTask(taskId: string): Promise<TaskDto> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    // Find the user by ID
    const retrievedTask = await Task.findById(taskId);
    return taskModelToTaskDto(retrievedTask);
  } catch (error) {
    throw new Error("Error retrieving task:" + error);
  }
}

export default getTask;
