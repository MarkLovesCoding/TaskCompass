import "server-only";

import connectDB from "@/db/connectDB";

import User from "@/db/(models)/User";

export async function updateTaskUsers(
  taskId: string,
  addedAssignees: string[],
  removedAssignees: string[]
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  try {
    if (addedAssignees.length > 0) {
      addedAssignees.forEach(async (userId) => {
        await User.findByIdAndUpdate(userId, { $push: { tasks: taskId } });
      });
    }
    if (removedAssignees.length > 0) {
      removedAssignees.forEach(async (userId) => {
        await User.findByIdAndUpdate(userId, { $pull: { tasks: taskId } });
      });
    }

    console.log("Users tasks lists updated");
  } catch (error) {
    throw new Error("Error updating task lists for users :" + error);
  }
}
