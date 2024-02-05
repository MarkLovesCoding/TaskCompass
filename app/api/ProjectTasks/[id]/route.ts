import connectDB from "@/app/utils/connectDB";
import Task from "@/app/(models)/Task";
import Project from "@/app/(models)/Project";
import User from "@/app/(models)/User";
import { ProjectType } from "@/app/types/types";
import { NextResponse, NextRequest } from "next/server";
// import { NextApiRequest } from "next";
type Params = {
  id: string;
};
export async function GET(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse> {
  await connectDB();

  const { id } = params;

  const foundProject: ProjectType | null = await Project.findOne({ _id: id });
  if (!foundProject) {
    return NextResponse.json({ error: "Project not found" }, { status: 500 });
  }
  const tasks = foundProject.tasks;

  const foundTasks = await Task.find({ _id: { $in: tasks } });
  if (!foundTasks) {
    return NextResponse.json({ error: "Tasks not found" }, { status: 500 });
  }
  return NextResponse.json({ foundProject, foundTasks }, { status: 200 });
}
