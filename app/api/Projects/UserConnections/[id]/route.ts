import connectDB from "@/db/connectDB";
import Project from "@/db/(models)/Project";
import User from "@/db/(models)/User";
import Task from "@/db/(models)/Task";
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

    const user = await User.findById(id).populate("projects").exec();
    if (user.connections.length > 0) {
      await user.populate("connections");
    } else console.log("no connections to populate");

    const { projects } = user;
    const { connections } = user;
    console.log("POPULATED__GROPS:", projects);
    console.log("POPULATED_CONNECTIONS:", connections);

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
