import connectDB from "@/db/connectDB";
import Task from "@/db/(models)/Task";
import Project from "@/db/(models)/Project";
import User from "@/db/(models)/User";
import { ProjectType, UserType } from "@/app/types/types";
import { NextResponse, NextRequest } from "next/server";
// import { NextApiRequest } from "next";

type Params = {
  id: string;
};
// type ExpandedProjectType = Omit<ProjectType, "users"> & { users: UserType[] };
export async function GET(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse> {
  const { id } = params;
  try {
    await connectDB();
    // console.log("param id: on Projects/[id]/route.ts:", id);
    const project = await Project.findById(id).populate("users");
    if (project.tasks.length > 0) {
      await project.populate("tasks");
    }
    console.log("projectsAPI:", project);
    if (!project) {
      return NextResponse.json(
        { message: "Error: Couldn't retrieve Projects" },
        { status: 500 }
      );
    }

    return NextResponse.json({ project }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
