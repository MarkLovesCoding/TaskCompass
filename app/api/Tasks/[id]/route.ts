import connectDB from "@/app/utils/connectDB";
import Task from "@/app/(models)/Task";
import Project from "@/app/(models)/Project";
import User from "@/app/(models)/User";
import { TaskType, ProjectType, ParamsType } from "@/app/types/types";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: ParamsType }
) {
  await connectDB();
  const { id } = params;

  const foundTask: TaskType | null = await Task.findOne({ _id: id });
  if (!foundTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  return NextResponse.json({ foundTask }, { status: 200 });
}

export async function PUT(
  request: Request,
  { params }: { params: ParamsType }
) {
  try {
    await connectDB();

    const id = params.id;
    const body = await request.json();
    const taskData: TaskType = body;
    const { project }: { project: string } = taskData;
    const { assignedTo }: { assignedTo: string } = taskData;
    const updateTaskData: TaskType | null = await Task.findByIdAndUpdate(
      { _id: id },
      {
        ...taskData,
      },
      { new: true }
    );
    if (!updateTaskData) {
      return NextResponse.json({ error: "Task not Updated" }, { status: 404 });
    }
    const existingProjectWithTask = await Project.findOne({
      tasks: { $in: [id] },
    }).populate("tasks");

    if (project != existingProjectWithTask._id) {
      try {
        await Project.findOneAndUpdate(
          { _id: existingProjectWithTask._id },
          { $pull: { tasks: id } },
          { new: true }
        );
      } catch (updateProjectError) {
        return NextResponse.json(
          {
            message: "Error updating existing Project and removing task",
            error: updateProjectError,
          },
          { status: 500 }
        );
      }
      try {
        await Project.findOneAndUpdate(
          { _id: project },
          { $push: { tasks: id } },
          { new: true }
        );
      } catch (updateProjectError) {
        return NextResponse.json(
          {
            message: "Error updating new Project and adding task",
            error: updateProjectError,
          },
          { status: 500 }
        );
      }
    }

    const existingUserWithTask = await User.findOne({
      tasks: { $in: [id] },
    });
    if (assignedTo != existingUserWithTask._id) {
      try {
        await User.findOneAndUpdate(
          { _id: existingUserWithTask._id },
          { $pull: { tasks: id } },
          { new: true }
        );
      } catch (updateUserError) {
        return NextResponse.json(
          {
            message: "Error updating existing user and removing task",
            error: updateUserError,
          },
          { status: 500 }
        );
      }
      try {
        await User.findOneAndUpdate(
          { _id: assignedTo },
          { $push: { tasks: id } },
          { new: true }
        );
      } catch (updateUserError) {
        return NextResponse.json(
          {
            message: "Error updating new user and adding task",
            error: updateUserError,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ message: "task Updated" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: ParamsType }) {
  try {
    await connectDB();

    const { id } = params;
    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json({ error: "task not found" }, { status: 404 });
    }
    const projectValue = task.project;
    const { assignedTo }: { assignedTo: string } = task;

    if (projectValue) {
      console.log("projectValuTrue:", projectValue);
      let project: ProjectType | null = await Project.findOne({
        _id: projectValue,
      });

      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }
      const index = project.tasks.indexOf(id);
      console.log("index:", index);

      if (index != -1) {
        project.tasks.splice(index, 1);
        console.log(project);
        try {
          await Project.findOneAndUpdate(
            { _id: project._id },
            { $pull: { tasks: id } },
            { new: true }
          );
        } catch (updateProjectError) {
          return NextResponse.json(
            {
              message: "Error updating project and deleting task",
              error: updateProjectError,
            },
            { status: 500 }
          );
        }
      }
    }
    try {
      await User.findOneAndUpdate(
        { _id: assignedTo },
        { $pull: { tasks: id } },
        { new: true }
      );
    } catch (updateUserError) {
      return NextResponse.json(
        {
          message: "Error updating user and deleting task",
          error: updateUserError,
        },
        { status: 500 }
      );
    }
    try {
      await Task.findByIdAndDelete(id);
    } catch (deleteTaskError) {
      return NextResponse.json(
        {
          message: "Error  deleting Task",
          error: deleteTaskError,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Task Deleted" }, { status: 200 });
  } catch (generalDeleteError) {
    console.log(generalDeleteError);
    return NextResponse.json(
      { message: "Error in Task deletion process", generalDeleteError },
      { status: 500 }
    );
  }
}
