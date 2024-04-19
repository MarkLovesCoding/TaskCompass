import { NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";
import crypto from "crypto";

export async function POST(req: Request, res: Response): Promise<any> {
  const { token } = await req.json();
  await connectDB();
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpiry: { $gt: Date.now() },
  });
  if (!user) {
    return NextResponse.json(
      { message: "Token is invalid or has expired" },
      { status: 400 }
    );
  }
  return new NextResponse(JSON.stringify(user), { status: 200 });
}
