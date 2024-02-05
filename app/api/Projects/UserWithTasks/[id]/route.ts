import connectDB from "@/app/utils/connectDB";
import Project from "@/app/(models)/Project";
import User from "@/app/(models)/User";
import Task from "@/app/(models)/Task";
import { ProjectType } from "@/app/types/types";

// import { NextApiRequest } from "next";

import { NextResponse, NextRequest } from "next/server";

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

    const user = await User.findById(id)
      .populate({
        path: "projects",
        populate: {
          path: "users",
          model: "User", // The model to use for population
        },
      })
      .populate({
        path: "projects",
        populate: {
          path: "tasks",
          model: "Task", // The model to use for population
        },
      })
      .exec();

    const { projects } = user;
    console.log("POPULATED__GROPS:", projects);

    // console.log("GOT THESE projectS FOR USER ID: id-->", id, "projectS", projects);
    if (!projects) {
      return NextResponse.json(
        { message: "Error: Couldn't retrieve Projects" },
        { status: 500 }
      );
    }

    return NextResponse.json({ projects }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
