"use server";
import connectDB from "@/db/connectDB";
import { taskModelToTaskDto } from "./utils";
import Task from "@/db/(models)/Task";

import type { TaskDto } from "@/use-cases/task/types";

async function getTask(taskId: string): Promise<TaskDto> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    const retrievedTask = await Task.findById(taskId);
    return taskModelToTaskDto(retrievedTask);
  } catch (error) {
    throw new Error("Error retrieving task:" + error);
  }
}

export default getTask;
