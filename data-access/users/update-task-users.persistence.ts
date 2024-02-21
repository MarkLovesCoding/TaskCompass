import "server-only";

import connectDB from "@/db/connectDB";

import User from "@/db/(models)/User";

import { UserDto } from "@/use-cases/user/types";
import { userModelToUserDto } from "./utils";
import { TaskDto } from "@/use-cases/task/types";

async function updateTaskUsers(
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
      // const userData = await User.findById(user);
      User.findByIdAndUpdate(user, { $pull: { tasks: taskId } });
    }
    for (const user of addedAssignees) {
      User.findByIdAndUpdate(user, { $push: { tasks: taskId } });
    }
  } catch (error) {
    throw new Error("Error updating task users" + error);
  }
}
export default updateTaskUsers;
