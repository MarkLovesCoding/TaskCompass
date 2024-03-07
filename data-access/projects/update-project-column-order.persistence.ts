import "server-only";

import connectDB from "@/db/connectDB";

import Project from "@/db/(models)/Project";

import { ProjectDto } from "@/use-cases/project/types";

// May require refactpr to get by ID
export async function updateProjectColumnOrder(
  projectId: string,
  type: string,
  columnOrder: string[]
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  console.log("-------------------------------projectId", projectId);

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      {
        _id: projectId,
      },
      {
        columnOrder: {
          ...columnOrder,
          [type]: columnOrder,
        },
      },
      {
        new: true,
      }
    );
    console.log("Project Updated", updatedProject);
  } catch (error) {
    throw new Error("Errorudpating project :" + error);
  }
}
