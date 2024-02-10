import connectDB from "@/app/utils/connectDB";
// import Project from "@/app/(models)/Project";
import Project from "@/db/(models)/Project";
import User from "@/db/(models)/User";
import { NextResponse, NextRequest } from "next/server";
import { ProjectType, UserType } from "@/app/types/types";
export async function POST(req: Request, res: Response) {
  try {
    await connectDB();
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Error connecting to DB", err },
      { status: 500 }
    );
  }
  try {
    const body = await req.json();
    const userSelected: UserType = body.userSelected;
    const project: ProjectType = body.project;
    console.log("USER SELECTED ^#Data :  ", userSelected);

    // const currentUsers = projectData.users;
    const duplicate = await Project.findOne({
      _id: project._id,
      users: { $in: [userSelected._id] },
    })
      .lean()
      .exec();
    if (duplicate) {
      return NextResponse.json(
        {
          message: "User is already in that project!",
        },
        { status: 409 }
      );
    } else {
      await Project.findOneAndUpdate(
        { _id: project._id },
        {
          $push: { users: userSelected._id },
        }
      );
      await User.findOneAndUpdate(
        {
          _id: userSelected._id,
        },
        {
          $push: { projects: project._id },
        }
      );
    }
    // const hashPassword = await bcrypt.hash(projectData.password, 12);
    // projectData.password = hashPassword;
    // await project.create(projectData);

    return NextResponse.json(
      { message: "User Added To Project" },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Error adding user to project", err },
      { status: 500 }
    );
  }
}
