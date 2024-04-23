"use server";

import connectDB from "@/db/connectDB";
import Project from "@/db/(models)/Project";

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
  } catch (error) {
    throw new Error("Error Updating projectcolumn order:" + error);
  }
}
