import "server-only";

import connectDB from "@/db/connectDB";

import Task from "@/db/(models)/Task";
import Project from "@/db/(models)/Project";
import User from "@/db/(models)/User";

import { TaskDto } from "@/use-cases/task/types";

export async function updateTask(task: TaskDto): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  try {
    const taskToBeUpdated = await Task.findByIdAndUpdate(task.id, task);
    // const updateProject = await Project.findByIdAndUpdate(newTask.project, {
    //   $push: { tasks: newTask._id },
    // });
    // console.log("updateProject", updateProject);
    // const users = task.assignees;
    // users.length > 0 &&
    //   users.forEach(async (userId) => {
    //     await User.findByIdAndUpdate(userId, { $push: { tasks: newTask._id } });
    //   });

    console.log(" Task Updated", taskToBeUpdated);
  } catch (error) {
    throw new Error("Error creating project:" + error);
  }
}
