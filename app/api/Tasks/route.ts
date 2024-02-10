import connectDB from "@/db/connectDB";
import Task from "@/db/(models)/Task";
import Project from "@/db/(models)/Project";
import User from "@/db/(models)/User";
import { NextResponse } from "next/server";
import { NextApiResponse, NextApiRequest } from "next";
import { TaskType } from "@/app/types/types";

export async function POST(req: Request, res: Response) {
  try {
    await connectDB();
    console.log("CONNECTED");
    const body = await req.json();
    const taskData: TaskType = body;
    const { project }: { project: string } = taskData;
    // const { assignedTo } = taskData;
    console.log("taskData", taskData);
    const createdTask: TaskType = await Task.create(taskData);
    if (!createdTask) {
      return NextResponse.json(
        { message: "Error creating task" },
        { status: 500 }
      );
    }
    const newTaskId = createdTask._id;
    console.log(newTaskId);
    console.log(project);
    try {
      await Project.findByIdAndUpdate(
        { _id: project },
        { $push: { tasks: newTaskId } },
        { new: true }
      );
    } catch (addNewTaskTProjectError) {
      return NextResponse.json(
        {
          message: "Error adding new task to Project",
          error: addNewTaskTProjectError,
        },
        { status: 500 }
      );
    }
    // try {
    //   await User.findByIdAndUpdate(
    //     { _id: assignedTo },
    //     { $push: { tasks: newTaskId } },
    //     { new: true }
    //   );
    // } catch (addNewTaskToUserError) {
    //   return NextResponse.json(
    //     {
    //       message: "Error adding new task to user",
    //       error: addNewTaskToUserError,
    //     },
    //     { status: 500 }
    //   );
    // }

    return NextResponse.json({ message: "task Created" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
export async function GET(req: Request) {
  try {
    await connectDB();

    const tasks: TaskType[] = await Task.find();
    // console.log("Gettoclets", tasks);
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
