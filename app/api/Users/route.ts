import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";
import Project from "@/db/(models)/Project";
import { UserType } from "@/app/types/types";
import bcrypt from "bcrypt";
import Team from "@/db/(models)/Team";
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
        name: "My Personal Project",
        description: "This is your default project",
        archived: false,
      };
      const newTeamData = {
        name: "My First Team",
      };

      try {
        //CREATE NEW PROJECT WITH FILLER NAMES
        let initialProjectAssigned = await Project.create({
          name: newProjectData.name,
          description: newProjectData.description,
        });

        //CREATE NEW USER

        //CREATE NEW TEAM WITH FILLER NAME
        let initialTeamAssigned = await Team.create({
          name: newTeamData.name,
          projects: [],
          users: [],
          createdBy: newUserId,
        });

        newUser.projectsAsAdmin.push(initialProjectAssigned._id);
        newUser.teamsAsAdmin.push(initialTeamAssigned._id);
        await newUser.save();

        initialProjectAssigned.users.push(newUser._id);
        initialProjectAssigned.team = initialTeamAssigned._id;
        initialProjectAssigned.createdBy = newUserId;
        await initialProjectAssigned.save();
        initialTeamAssigned.projects.push(initialProjectAssigned._id);
        initialTeamAssigned.users.push(newUser._id);
        await initialTeamAssigned.save();
      } catch (error) {
        console.error("Error creating User and Defaults:", error);
        // return false;

        // Handle the error or return from the function as needed
      }
      // return true; // Continue the sign-in process
    }
    return NextResponse.json({ message: "User Created" }, { status: 201 });
  } catch (err) {
    // console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
