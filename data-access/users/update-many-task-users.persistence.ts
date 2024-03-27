import "server-only";

import connectDB from "@/db/connectDB";

import User from "@/db/(models)/User";

async function updateManyTaskUsers(
  taskId: string,
  removedAssignees: string[],
  addedAssignees: string[]
): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    for (const user of removedAssignees) {
      await User.findByIdAndUpdate(user, { $pull: { tasks: taskId } });
    }
    for (const user of addedAssignees) {
      await User.findByIdAndUpdate(user, { $push: { tasks: taskId } });
    }
  } catch (error) {
    throw new Error("Error updating task users" + error);
  }
}
export default updateManyTaskUsers;
