import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";
import { UserType } from "@/lib/types/types";
import { NextResponse, NextRequest } from "next/server";
// import { NextApiRequest } from "next";

type Params = {
  id: string;
};
export async function GET(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse> {
  const { id } = params;
  try {
    await connectDB();

    const user: UserType | null = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { message: "Error: Couldn't retrieve User" },
        { status: 500 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
