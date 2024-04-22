import React from "react";
import { UserPageComponent } from "@/app/dashboard/[id]/user-page-component";
import getUser from "@/data-access/users/get-user.persistence";
import type { UserDto } from "@/use-cases/user/types";
import { unstable_noStore } from "next/cache";
import { sessionAuth } from "@/lib/sessionAuth";
import { notFound } from "next/navigation";
import getUserTeamsAsMember from "@/data-access/teams/get-user-teams-as-member";
import getUserProjectsAsMember from "@/data-access/projects/get-user-projects-as-member";
import getUserTeamsAsAdmin from "@/data-access/teams/get-user-teams-as-admin";
import getUserProjectsAsAdmin from "@/data-access/projects/get-user-projects-as-admin";
import getUserTasks from "@/data-access/tasks/get-user-tasks.persistence";
type ParamsType = {
  id: string;
};

const UserPage = async ({ params }: { params: ParamsType }) => {
  unstable_noStore();
  const { id } = params;

  const session = await sessionAuth(`/dashboard/${id}`);

  // if (!session) {
  //   redirect(`/api/auth/signin?callbackUrl=/USERPAGE-CLEAN/${id}`);
  // }
  // console.log("session", session);
  const sessionUser = session?.user.id;
  let user: UserDto;
  if (sessionUser == id) {
    user = await getUser(id);
  } else {
    console.log("user not found");
    return notFound();
  }
  // const userIdString = user._id;
  const usersTeamsAsMember = await getUserTeamsAsMember(user);
  const usersProjectsAsMember = await getUserProjectsAsMember(user);
  const usersTeamsAsAdmin = await getUserTeamsAsAdmin(user);
  const usersProjectsAsAdmin = await getUserProjectsAsAdmin(user);
  const userTasks = await getUserTasks(user);
  // add params
  // const userId = params.userData.id;
  return (
    <div>
      <UserPageComponent
        user={user}
        usersTeamsAsMember={usersTeamsAsMember}
        usersTeamsAsAdmin={usersTeamsAsAdmin}
        usersProjectsAsAdmin={usersProjectsAsAdmin}
        usersProjectsAsMember={usersProjectsAsMember}
        userTasks={userTasks}
      />
    </div>
  );
};

export default UserPage;
