import connectDB from "@/app/utils/connectDB";
import User from "@/app/(models)/User";
import { UserType, ProjectType } from "@/app/types/types";
import { NextResponse, NextRequest } from "next/server";
// import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    image: undefined;
    role: string;
  };
};
type ExpandedUserType = Omit<UserType, "connections" | "projects"> & {
  connections: UserType[];
  projects: ProjectType[];
};
export async function GET(request: Request): Promise<NextResponse> {
  const session: Session | null = await getServerSession(options);
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/Users/Connections");
  }
  const id = session.user.id;
  try {
    await connectDB();
    const usersWithConnectionsPopulated = await User.findById(id).populate({
      path: "connections",
      populate: { path: "projects" },
    });
    if (!usersWithConnectionsPopulated) {
      return NextResponse.json(
        { message: "Error: Couldn't retrieve User's Connections" },
        { status: 500 }
      );
    }

    const usersFromConnections = usersWithConnectionsPopulated.connections;
    console.log("USER CONNECTIONS POPULATED HERE++++:", usersFromConnections);
    const usersFromUserProjectsFullPopulated: ExpandedUserType =
      await User.findById(id)
        .populate({
          path: "projects",
          populate: {
            path: "users",
          },
        })
        .exec();

    if (!usersFromUserProjectsFullPopulated) {
      return NextResponse.json(
        { message: "Error: Couldn't retrieve Users list from User's Projects" },
        { status: 500 }
      );
    }

    const allUsers: UserType[] =
      usersFromUserProjectsFullPopulated.projects.reduce(
        //@ts-expect-error
        (users, project) => users.concat(project.users),
        []
      );

    const availableAssignees = [...usersFromConnections, ...allUsers];

    return NextResponse.json({ availableAssignees }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
