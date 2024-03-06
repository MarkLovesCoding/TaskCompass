// import "server-only";
"use server";
import connectDB from "@/db/connectDB";

import Task from "@/db/(models)/Task";

import type { ProjectDto } from "@/use-cases/project/types";
import type { TaskDto } from "@/use-cases/task/types";
import { taskModelToTaskDto } from "./utils";
// May require refactpr to get by ID
async function getProjectTasks(project: ProjectDto): Promise<TaskDto[]> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  // const teamId = team.id;
  const taskIds = project.tasks;

  const tasks: TaskDto[] = [];
  try {
    // Find the user by ID
    for (let taskId of taskIds) {
      const task = await Task.findById(taskId);

      tasks.push(taskModelToTaskDto(task));
    }
  } catch (error) {
    throw new Error("Error retrieving team:" + error);
  }
  return tasks;
}

export default getProjectTasks;
