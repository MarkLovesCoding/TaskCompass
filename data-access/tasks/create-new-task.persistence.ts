import "server-only";

import connectDB from "@/db/connectDB";

import Task from "@/db/(models)/Task";
import { CreateTaskDto } from "@/use-cases/task/types";

export async function createNewTask(task: CreateTaskDto): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  try {
    const newTask = await Task.create(task);
    console.log("New Project Created", newTask);
  } catch (error) {
    throw new Error("Error creating project:" + error);
  }
}
