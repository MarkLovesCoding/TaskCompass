"use server";
import connectDB from "@/db/connectDB";
import { taskModelToTaskDto } from "./utils";
import Task from "@/db/(models)/Task";

import type { ProjectDto } from "@/use-cases/project/types";
import type { TaskDto } from "@/use-cases/task/types";

async function getProjectArchivedTasks(
  project: ProjectDto
): Promise<TaskDto[]> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  const taskIds = project.tasks;
  const archivedtasks: TaskDto[] = [];
  try {
    // Find the user by ID
    for (let taskId of taskIds) {
      const task = await Task.findById(taskId);
      if (!task.archived) {
        archivedtasks.push(taskModelToTaskDto(task));
      }
    }
  } catch (error) {
    throw new Error("Error retrieving archived tasks:" + error);
  }
  return archivedtasks;
}

export default getProjectArchivedTasks;
