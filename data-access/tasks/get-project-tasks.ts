import "server-only";

import connectDB from "@/db/connectDB";

import Task from "@/db/(models)/Task";

import type { ProjectDto } from "@/use-cases/project/types";
import type { TaskDto } from "@/use-cases/task/types";
import { taskToTaskDto } from "./get-task";
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
  console.log("taskIds", taskIds);
  const tasks: TaskDto[] = [];
  try {
    // Find the user by ID
    for (let taskId of taskIds) {
      console.log("taskId", taskId);
      const task = await Task.findById(taskId);
      console.log("task", task);

      tasks.push(taskToTaskDto(task));
    }
  } catch (error) {
    throw new Error("Error retrieving team:" + error);
  }
  return tasks;
}

export default getProjectTasks;
