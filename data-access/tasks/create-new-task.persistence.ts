import "server-only";

import connectDB from "@/db/connectDB";

import Task from "@/db/(models)/Task";
import Project from "@/db/(models)/Project";
import { TaskModelType } from "./types";
import { CreateTaskDto } from "@/use-cases/task/types";

export async function createNewTask(task: CreateTaskDto): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  try {
    const newTask: TaskModelType = await Task.create(task);

    const updateProject =
      newTask &&
      (await Project.findByIdAndUpdate(
        newTask.project,
        {
          $push: { tasks: newTask._id },
        },
        { new: true }
      ));

    updateProject.tasksOrder.priority.Medium.push(newTask._id);
    updateProject.tasksOrder.status["Not Started"].push(newTask._id);
    updateProject.tasksOrder.category.Other.push(newTask._id);
    updateProject.markModified("tasksOrder");

    await updateProject.save();
  } catch (error) {
    throw new Error("Error creating project:" + error);
  }
}
