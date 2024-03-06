import "server-only";

import connectDB from "@/db/connectDB";

import Task from "@/db/(models)/Task";
import { TaskEntity } from "@/entities/Task";
import { OrderInLists } from "@/data-access/tasks/types";
import { TaskDto } from "@/use-cases/task/types";
import { taskToDto } from "@/use-cases/task/utils";
export async function updateTasksOrderInLists(tasks: TaskDto[]): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    //validateTasks via Entity validation and convert to DTO
    const validatedTasks = tasks.map((task) => {
      const taskAsEntity = new TaskEntity({ ...task });
      return taskToDto(taskAsEntity);
    });

    //update tasks in db
    validatedTasks.forEach(async (task) => {
      await Task.findByIdAndUpdate(task.id, task);
    });

    console.log("Tasks lists updated");
  } catch (error) {
    throw new Error("Error updating task lists orders:" + error);
  }
}
