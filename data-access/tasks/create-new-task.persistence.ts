import "server-only";

import connectDB from "@/db/connectDB";

import Task from "@/db/(models)/Task";
import Project from "@/db/(models)/Project";
import User from "@/db/(models)/User";
import { TaskModelType } from "./types";
import { ProjectModelType } from "../projects/types";
import { CreateTaskDto } from "@/use-cases/task/types";

export async function createNewTask(task: CreateTaskDto): Promise<void> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }
  try {
    console.log(
      "#####################################before create task",
      task
    );
    const newTask: TaskModelType = await Task.create(task);
    console.log("#############################newTask", newTask);

    const updateProject =
      newTask &&
      (await Project.findByIdAndUpdate(
        newTask.project,
        {
          $push: { tasks: newTask._id },
        },
        { new: true }
      ));

    console.log(
      "####################################updateProject",
      updateProject
    );
    // const nextPriorityIndex = updateProject.listsNextAvailable.priority.Medium;
    // const nextStatusIndex =
    //   updateProject.listsNextAvailable.status["Not Started"];
    // const nextCategoryIndex = updateProject.listsNextAvailable.category.Other;
    // newTask.orderInLists.priority = ["Medium", nextPriorityIndex];
    // newTask.orderInLists.status = ["Not Started", nextStatusIndex];
    // newTask.orderInLists.category = ["Other", nextCategoryIndex];
    // newTask.markModified("orderInLists");
    // await newTask.save();

    // updateProject.listsNextAvailable.priority.Medium += 1;
    // console.log(
    //   "updateProject.listsNextAvailable.priority.Medium",
    //   updateProject.listsNextAvailable.priority.Medium
    // );
    // updateProject.listsNextAvailable.status["Not Started"] += 1;
    // updateProject.listsNextAvailable.category.Other += 1;
    // console.log("-------------updatedProject", updateProject);
    // updateProject.markModified("listsNextAvailable");

    updateProject.tasksOrder.priority.Medium.push(newTask._id);
    updateProject.tasksOrder.status["Not Started"].push(newTask._id);
    updateProject.tasksOrder.category.Other.push(newTask._id);
    updateProject.markModified("tasksOrder");

    await updateProject.save();

    // const users = task.assignees;
    // users.length > 0 &&
    //   users.forEach(async (userId) => {
    //     await User.findByIdAndUpdate(userId, { $push: { tasks: newTask._id } });
    //   });

    console.log("##########################New Task Created", newTask);
  } catch (error) {
    throw new Error("Error creating project:" + error);
  }
}
