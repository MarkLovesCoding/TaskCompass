"use server";
import connectDB from "@/db/connectDB";
import Project from "@/db/(models)/Project";

export async function updateProjectTasksOrder(
  projectId: string
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    const project = await Project.findById(projectId);
  } catch (error) {
    throw new Error(
      "Error updating project tasks order from card change:" + error
    );
  }
}
