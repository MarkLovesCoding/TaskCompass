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

  // const userId = user.id;
  try {
    // Find the user by ID
    for (const user of removedAssignees) {
      console.log("user removed", user);
      console.log("task id", taskId);
      // const userData = await User.findById(user);
      await User.findByIdAndUpdate(user, { $pull: { tasks: taskId } });
    }
    for (const user of addedAssignees) {
      console.log("user added", user);
      console.log("task id", taskId);
      await User.findByIdAndUpdate(user, { $push: { tasks: taskId } });
    }
  } catch (error) {
    throw new Error("Error updating task users" + error);
  }
}
export default updateManyTaskUsers;
