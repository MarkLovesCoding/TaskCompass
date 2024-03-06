import "server-only";

import connectDB from "@/db/connectDB";

import Task from "@/db/(models)/Task";
import { OrderInLists } from "@/data-access/tasks/types";
import { TaskDto } from "@/use-cases/task/types";
export async function updateTaskOrderInLists(task: TaskDto): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    await Task.findByIdAndUpdate(task.id, task);

    // const updateProject = await Project.findByIdAndUpdate(newTask.project, {
    //   $push: { tasks: newTask._id },
    // });
    // console.log("updateProject", updateProject);
    // const users = task.assignees;
    // users.length > 0 &&
    //   users.forEach(async (userId) => {
    //     await User.findByIdAndUpdate(userId, { $push: { tasks: newTask._id } });
    //   });

    console.log("Users tasks lists updated");
  } catch (error) {
    throw new Error("Error updating task lists for users :" + error);
  }
}
