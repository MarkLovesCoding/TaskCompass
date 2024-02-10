import "server-only";

import connectDB from "@/db/connectDB";

import Task from "@/db/(models)/Task";

import { TaskDto } from "@/use-cases/task/types";

type TaskModelType = {
  _id: string;
  name: string;
  description: string;
  project: string;
  assignees: string[];
  dueDate: number;
  startDate: number;
  complete: boolean;
  priority: string;
  status: string;
  category: string;
  createdBy: string;
};
export function taskToTaskDto(task: TaskModelType) {
  return {
    id: task._id,
    name: task.name,
    description: task.description,
    project: task.project,
    assignees: task.assignees,
    dueDate: task.dueDate,
    startDate: task.startDate,
    complete: task.complete,
    priority: task.priority,
    status: task.status,
    label: task.category,
  };
}
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
    const retrievedTask = await Task.findById(taskId);
    return taskToTaskDto(retrievedTask);
  } catch (error) {
    throw new Error("Error retrieving task:" + error);
  }
}

export default getTask;
