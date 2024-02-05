import React from "react";
import { UserType } from "../types/types";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const getUserFromId = async (id: string) => {
  console.log("ID_______________:", id);
  try {
    const res = await fetch(`http://localhost:3000/api/Users/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok)
      throw new Error(
        "failed to fetch data on page load. Status:" + res.status
      );
    const data = await res.json();
    const { user } = data;
    return user;
  } catch (err) {
    console.log("Failed to get User:", err);
  }
};

const UserCardSmall = async ({ userData }: { userData: string }) => {
  console.log("user_________________________", userData);
  const user: UserType = await getUserFromId(userData);
  console.log("userdata", user);

  return (
    <>
      <Card className=" p-3 flex justify-center flex-row">
        <Link href={`/UserPage/${userData}`} style={{ display: "contents" }}>
          <div className="flex items-center ">
            <Avatar>
              <AvatarFallback>
                {user.name[0].toLocaleUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardHeader>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </CardHeader>
        </Link>
      </Card>
    </>
  );
};

export default UserCardSmall;
