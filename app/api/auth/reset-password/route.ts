import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";
import bcrypt from "bcrypt";
import { resetPasswordAction } from "@/app/reset-password/[token]/_actions/reset-password.action";

export async function POST(req: Request, res: Response): Promise<any> {
  const { userId, password, passwordConfirm } = await req.json();
  try {
    await resetPasswordAction({ userId, password, passwordConfirm });
    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: (err as Error).message },
      { status: 500 }
    );
  }
}
