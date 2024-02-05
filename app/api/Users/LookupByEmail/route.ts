import connectDB from "@/app/utils/connectDB";
import User from "@/app/(models)/User";
import { UserType } from "@/app/types/types";
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
    console.log("user___from connectionpost______________", user);

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
