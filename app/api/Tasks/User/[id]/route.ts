import connectDB from "@/db/connectDB";
import Task from "@/db/(models)/Task";

import Project from "@/db/(models)/Project";
import User from "@/db/(models)/User";
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
