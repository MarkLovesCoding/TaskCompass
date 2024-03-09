"use server";
import connectDB from "@/db/connectDB";

import Project from "@/db/(models)/Project";

import { ProjectDto } from "@/use-cases/project/types";
import { TasksOrder } from "./types";

// May require refactpr to get by ID
export async function updateProjectTasksOrder(
  projectId: string,
  taskId: string,
  priority: string,
  category: string,
  status: string
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    const project = await Project.findById(projectId);
    // const updatedProject = await Project.findByIdAndUpdate(
    //   {
    //     _id: projectId,
    //   },
    //   {
    //     tasksOrder: tasksOrder,
    //   },
    //   {
    //     new: true,
    //   }
    // );
    // console.log("Project Updated", updatedProject);
  } catch (error) {
    throw new Error("Error udpating project :" + error);
  }
}
