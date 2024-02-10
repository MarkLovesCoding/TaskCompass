import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "@/app/api/auth/[...nextauth]/options.js";
import { UserPageComponent } from "@/app/USERPAGE-CLEAN/[id]/user-page-component";
import getUser from "@/data-access/users/get-user";
import type { UserDto } from "@/use-cases/user/types";

type ParamsType = {
  id: string;
};

const UserPage = async ({ params }: { params: ParamsType }) => {
  const { id } = params;
  const session = await getServerSession(options);

  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=/USERPAGE-CLEAN/${id}`);
  }
  const user: UserDto = await getUser(params.id);
  const sessionUserId = session.user.id;
  console.log("user received,", user);
  // const userIdString = user._id;
  // add params
  // const userId = params.userData.id;
  return (
    <div>
      <UserPageComponent user={user} />
    </div>
  );
};

export default UserPage;
