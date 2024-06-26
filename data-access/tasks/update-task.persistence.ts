"use server";
import connectDB from "@/db/connectDB";
import Task from "@/db/(models)/Task";

import type { TaskDto } from "@/use-cases/task/types";

export async function updateTask(task: TaskDto): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  try {
    const taskToBeUpdated = await Task.findByIdAndUpdate(task.id, task);
  } catch (error) {
    throw new Error("Error creating project:" + error);
  }
}
