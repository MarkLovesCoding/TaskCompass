"use server";
import connectDB from "@/db/connectDB";
import { taskToDto } from "@/use-cases/task/utils";
import Task from "@/db/(models)/Task";
import { TaskEntity } from "@/entities/Task";
import { ValidationError } from "@/use-cases/utils";

import type { TaskDto } from "@/use-cases/task/types";

export async function updateTasks(tasks: TaskDto[]): Promise<void> {
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
    //handle validation errors in data access layer to avoid many db calls
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
