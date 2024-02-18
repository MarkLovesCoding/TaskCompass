import React from "react";
import { UserPageComponent } from "@/app/USERPAGE-CLEAN/[id]/user-page-component";
import getUser from "@/data-access/users/get-user.persistence";
import type { UserDto } from "@/use-cases/user/types";
import { unstable_noStore } from "next/cache";
import { sessionAuth } from "@/lib/sessionAuth";
import { notFound } from "next/navigation";
type ParamsType = {
  id: string;
};

const UserPage = async ({ params }: { params: ParamsType }) => {
  unstable_noStore();
  const { id } = params;

  const session = await sessionAuth(`USERPAGE-CLEAN/${id}`);
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
  // add params
  // const userId = params.userData.id;
  return (
    <div>
      <UserPageComponent user={user} />
    </div>
  );
};

export default UserPage;
