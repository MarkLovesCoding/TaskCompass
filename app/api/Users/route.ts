import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";
import Project from "@/db/(models)/Project";
import { UserType } from "@/app/types/types";
import bcrypt from "bcrypt";
export async function POST(req: Request, res: Response): Promise<any> {
  try {
    await connectDB();
    console.log("CONNECTE TO DB");
    console.log("IN API req___________:", req);

    const body = await req.json();
    const userData: UserType = body;
    //confirm Data exists
    console.log("IN API USER DATA___________:", userData);

    if (!userData?.email || !userData.password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    //check for duplicate emails
    const duplicate = await User.findOne({ email: userData.email })
      .lean()
      .exec();
    if (duplicate) {
      return NextResponse.json(
        {
          message: "Duplicate Email",
        },
        { status: 409 }
      );
    }
    const hashPassword: string = await bcrypt.hash(userData.password, 12);
    userData.password = hashPassword;
    let newUser = await User.create(userData);
    console.log("IN API NEW USER___________:", newUser);

    const newUserId: string = newUser._id;

    // CHECKS IF MANUALLY ADDED USER IS FIRST TIME LOGGING IN>
    if (newUser) {
      const newProjectData = {
        name: userData.name + "'s Tickets",
        // users: [
        //   { userId: newUserId, name: newUser.name, email: newUser.email },
        // ],
        users: [newUserId],
        isDefault: true,
      };
      console.log("NEW Project DATA", newProjectData);

      let initialProjectAssigned, newProjectId;
      try {
        console.log("Try create Project");

        initialProjectAssigned = await Project.create({
          name: newProjectData.name,
          users: [...newProjectData.users],
          isDefault: newProjectData.isDefault,
        });
        console.log("initial Project DATA", initialProjectAssigned);

        console.log("new Project created", initialProjectAssigned);
        newProjectId = initialProjectAssigned._id;
        console.log("init Project", newProjectId);
      } catch (error) {
        console.error("Error creating or updating initial Project:", error);
        await User.findByIdAndDelete(newUserId);
        console.log("User deleted due to Project creation failure");

        return false;
      }

      try {
        await User.findByIdAndUpdate(newUserId, {
          $push: { projects: newProjectId },
          $unSet: { firstLogIn: 1 },
        });
      } catch (error) {
        console.error("Error creating user:", error);
        return false;
      }
    }
    return NextResponse.json({ message: "User Created" }, { status: 201 });
  } catch (err) {
    // console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
