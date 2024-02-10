import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";

type ConnectionsBody = {
  userId: string;
  connectionUserData: string;
};
export async function POST(request: Request, res: Response) {
  await connectDB();
  const body = await request.json();
  const usersData: any = body;
  const { userId, connectionUserData } = usersData;
  console.log("USERSDATA___________:_________", usersData);
  console.log("connectionUserData:_________", connectionUserData);
  const userData = await User.findById(userId);
  const userConnections = userData.connections;
  if (userConnections.includes(connectionUserData)) {
    return NextResponse.json(
      { message: "You're already connected with that user!" },
      { status: 400 }
    );
  }
  if (userId == connectionUserData) {
    return NextResponse.json(
      { message: "You can't add yourself!" },
      { status: 400 }
    );
  }
  if (!userId) {
    return NextResponse.json(
      { message: "Error with User ID. Please Try again in a few minutes" },
      { status: 400 }
    );
  }
  if (!connectionUserData) {
    return NextResponse.json(
      { message: "User doesn't exist" },
      { status: 400 }
    );
  }
  try {
    // const user = await User.findOne({ _id: userId });
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          connections: connectionUserData,
        },
      },
      { new: true }
    );
    console.log("User,", user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating User Connections:", error },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "User Connections Updated" },
    { status: 200 }
  );
  //confirm Data exists
}
