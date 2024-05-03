import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/db/connectDB";

import { forgotPasswordAction } from "@/app/forgot-password/_actions/forgot-password.action";
import User from "@/db/(models)/User";
import crypto from "crypto";
import { Resend } from "resend";
import { ValidationError } from "@/use-cases/utils";

export async function POST(req: Request, res: Response): Promise<any> {
  await connectDB();

  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }
  try {
    await forgotPasswordAction({ email });
    return NextResponse.json(
      { message: "Password Reset Link Sent" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error | ValidationError).message },
      { status: 500 }
    );
  }
}
