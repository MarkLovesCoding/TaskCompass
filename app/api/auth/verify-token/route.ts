import { NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";
import crypto from "crypto";
import { verifyResetTokenAction } from "@/app/reset-password/[token]/_actions/verify-reset-token.action";

export async function POST(req: Request, res: Response): Promise<any> {
  const { token }: { token: string } = await req.json();
  try {
    const validatedUser = await verifyResetTokenAction(token);
    return NextResponse.json(JSON.stringify(validatedUser), { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: (err as Error).message },
      { status: 500 }
    );
  }
}
