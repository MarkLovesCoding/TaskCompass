import "server-only";

import connectDB from "@/db/connectDB";

import Task from "@/db/(models)/Task";

import { TaskDto } from "@/use-cases/task/types";

// May require refactpr to get by ID
async function updateTask(task: TaskDto): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  const taskId = task.id;

  try {
    const newTask = await Task.create({
      title: task.name,
      description: task.description,
      project: task.project,
      assignees: task.assignees,
      dueDate: task.dueDate,
      startDate: task.startDate,
      complete: task.complete,
      status: task.status,
      priority: task.priority,
      label: task.label,
    });
    console.log("New Task Created", newTask);
  } catch (error) {
    throw new Error("Error creating new task :" + error);
  }
}

export default updateTask;
