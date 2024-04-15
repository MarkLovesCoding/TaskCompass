import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";
import { UserType } from "@/lib/types/types";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: Request, response: Response) {
  try {
    await connectDB();
    const body = await request.json();
    const { email } = body;
    if (!email) {
      return NextResponse.json(
        { message: "Email is required in the request body" },
        { status: 400 }
      );
    }

    const user: UserType | null = await User.findOne({
      email,
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found with the provided email" },
        { status: 400 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
