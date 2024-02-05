import connectDB from "@/app/utils/connectDB";
import User from "@/app/(models)/User";
import Project from "@/app/(models)/Project";
import { UserType, ProjectType } from "@/app/types/types";
import { NextResponse, NextRequest } from "next/server";
// import { NextApiRequest } from "next";

type Params = {
  id: string;
};
type ExpandedProjectType = Omit<ProjectType, "users"> & {
  users: UserType[];
};
type ExpandedUserType = Omit<UserType, "connections" | "projects"> & {
  connections: UserType[];
  projects: ExpandedProjectType[];
};
export async function GET(
  request: Request,
  { params }: { params: Params }
): Promise<NextResponse> {
  const { id } = params;

  try {
    await connectDB();
    const user = await User.findById(id);
    const usersWithConnectionsPopulated = await User.findById(id).populate(
      "connections"
    );

    const connections = usersWithConnectionsPopulated.connections;
    console.log(
      "USERS WITH CONNECTIONSPOPULATED:___________",
      usersWithConnectionsPopulated
    );
    if (!usersWithConnectionsPopulated) {
      return NextResponse.json(
        { message: "Error: Couldn't retrieve User's Connections" },
        { status: 500 }
      );
    }

    const availableAssignees = [user, ...connections];

    return NextResponse.json({ availableAssignees }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
