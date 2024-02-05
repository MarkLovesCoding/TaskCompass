import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import UserCardLarge from "@/app/(components)/UserCardLarge";
import { options } from "@/app/api/auth/[...nextauth]/options.js";
import { UserType, TaskType, ProjectType } from "@/app/types/types";
type VerboseUserType = Omit<UserType, "tasks" | "projects" | "connections"> & {
  tasks: TaskType[];
  projects: ProjectType[];
  connections: UserType[];
};

const getUserById = async (id: string) => {
  console.log("about to get verbose from  id:", id);
  try {
    const res = await fetch(
      `http://localhost:3000/api/Users/VerboseData/${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok)
      throw new Error(
        "failed to fetch data on page load. Status:" + res.status
      );
    const data = await res.json();
    const { user } = data;
    console.log("GET dadta FROM ID USER:::::::::::::::::::::", user);
    return user;
  } catch (err) {
    console.log("Failed to get User:", err);
  }
};

type ParamsType = {
  id: string;
};

const UserPage = async ({ params }: { params: ParamsType }) => {
  const { id } = params;
  const session = await getServerSession(options);

  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=/UserPage/${id}`);
  }

  const sessionUserId = session.user.id;
  const isUserProfile = sessionUserId == id;
  const user = await getUserById(id);
  // const userIdString = user._id;
  // add params
  // const userId = params.userData.id;
  return (
    <div>
      {/* {isUserProfile ? <h2>Your Profile</h2> : <h2>User Profile</h2>} */}
      <UserCardLarge user={user} />
    </div>
  );
};

export default UserPage;
