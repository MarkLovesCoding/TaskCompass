import connectDB from "@/db/connectDB";
import Task from "@/db/(models)/Task";
import Project from "@/db/(models)/Project";
import User from "@/db/(models)/User";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: Request, res: Response) {
  await connectDB();

  try {
    const body = await req.json();
    const projectData = body.formData;
    console.log("projectData :  ", projectData);
    if (!projectData?.name) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }
    const currentUsers = projectData.users;
    const duplicate = await Project.findOne({
      name: projectData?.name,
      //
      //
      //
      //NEEDS UPDATING
      //
    })
      .lean()
      .exec();
    if (duplicate) {
      return NextResponse.json(
        {
          message: "Same project exists!",
        },
        { status: 409 }
      );
    }
    const newProject = await Project.create(projectData);

    console.log("newproject created", newProject);
    try {
      await User.findByIdAndUpdate(
        { _id: newProject.users[0] },
        {
          $push: { projects: newProject._id },
        }
      );
    } catch (err) {
      console.log(
        "Unable to update user with Project id (Create Project Route): ",
        err
      );
    }
    return NextResponse.json({ message: "Project Created" }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
