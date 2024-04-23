"use server";
import connectDB from "@/db/connectDB";
import Project from "@/db/(models)/Project";

import type { TasksOrder } from "./types";

export async function updateProjectTasksOrder(
  projectId: string,
  tasksOrder: TasksOrder
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      {
        _id: projectId,
      },
      {
        tasksOrder: tasksOrder,
      },
      {
        new: true,
      }
    );
  } catch (error) {
    throw new Error("Error udpating project tasks order:" + error);
  }
}
