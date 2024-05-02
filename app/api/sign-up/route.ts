import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";
import Project from "@/db/(models)/Project";
import { UserType } from "@/lib/types/types";
import bcrypt from "bcrypt";
import Team from "@/db/(models)/Team";
import { createNewEmailUserAction } from "@/app/registration/_actions/create-new-email-user.action";
type UserInfo = {
  name: string;
  email: string;
  password: string;
  role: string;
  firstLogIn: boolean;
};
export async function POST(req: Request, res: Response): Promise<any> {
  try {
    await connectDB();
  } catch (err) {
    NextResponse.json({ message: "Error connecting to DB" }, { status: 500 });
  }
  try {
    const body: UserInfo = await req.json();

    //enact action layer
    await createNewEmailUserAction(body);

    return NextResponse.json({ message: "User Created" }, { status: 201 });
  } catch (err) {
    // console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
