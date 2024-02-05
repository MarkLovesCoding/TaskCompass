import connectDB from "@/app/utils/connectDB";
import Task from "@/app/(models)/Task";

import Project from "@/app/(models)/Project";
import User from "@/app/(models)/User";
import { TaskType, ParamsType } from "@/app/types/types";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: ParamsType }
) {
  const { id } = params;

  try {
    await connectDB();

    const foundTasks: TaskType[] = await Task.find({ assignedTo: id });

    if (foundTasks.length === 0) {
      return NextResponse.json(
        { error: "No Tasks found for the specified user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ foundTasks }, { status: 200 });
  } catch (error) {
    console.error("Error finding Tasks:", error);
    return NextResponse.json(
      { message: "Error finding Tasks", error },
      { status: 500 }
    );
  }
}
