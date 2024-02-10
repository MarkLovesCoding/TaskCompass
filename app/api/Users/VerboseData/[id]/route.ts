import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";
import Project from "@/db/(models)/Project";
import Task from "@/db/(models)/Task";
import { ProjectType, TaskType, UserType } from "@/app/types/types";
import { NextResponse, NextRequest } from "next/server";
// import { NextApiRequest } from "next";

type Params = {
  id: string;
};

export async function GET(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse> {
  const { id } = params;
  try {
    await connectDB();

    const user = await User.findById(id).populate("projects");
    console.log("USER from ID with ProjectS:,", user);
    if (user && user.connections && user.connections.length > 0) {
      console.log("TRYING TO POPULATE CONNECTIONs");

      await user.populate("connections");
    } else {
      console.log("DIDnT POPULATE CONNECTIONS");
    }
    console.log("USER from ID with Connections:,", user);

    if (user && user.tasks && user.tasks.length > 0) {
      console.log("TRYING TO POPULATE taskTTTTTTTTTTTTTTTTs");

      await user.populate("tasks");
    } else {
      console.log("DIDNT TRY TO POPULATE taskTTTTTTTTTTTTTTTTs");
    }
    console.log("USER from ID with Tasks:,", user);

    if (!user) {
      return NextResponse.json(
        { message: "Error: Couldn't retrieve User" },
        { status: 500 }
      );
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
