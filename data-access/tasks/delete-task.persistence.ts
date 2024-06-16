"use server";
import connectDB from "@/db/connectDB";
import Task from "@/db/(models)/Task";

export async function deleteTask(taskId: string): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  try {
    // const newTask: TaskModelType = await Task.create(task);
    const task = await Task.findByIdAndDelete(taskId);
  

  } catch (error) {
    throw new Error("Error deleting task:" + error);
  }
}
