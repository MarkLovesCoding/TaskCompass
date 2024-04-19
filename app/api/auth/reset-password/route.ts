import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";
import bcrypt from "bcrypt";

export async function POST(req: Request, res: Response): Promise<any> {
  await connectDB();

  const { userId, password, passwordConfirm } = await req.json();
  //confirm Data exists

  if (!password || !passwordConfirm) {
    return NextResponse.json(
      { message: "Password and Confirmed Password are required" },
      { status: 400 }
    );
  }

  const existingUser = await User.findById(userId);
  if (!existingUser) {
    return NextResponse.json(
      {
        message: "Error Finding User. Please try again.",
      },
      { status: 409 }
    );
  }
  try {
    const hashPassword: string = await bcrypt.hash(password, 12);
    await User.findByIdAndUpdate(existingUser.id, {
      password: hashPassword,
    });
    return NextResponse.json(
      {
        message: "Password Updated Successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error Updating User Password. Please try again.",
      },
      { status: 409 }
    );
  }
}
