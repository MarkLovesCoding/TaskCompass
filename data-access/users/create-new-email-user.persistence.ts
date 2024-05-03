"use server";
import connectDB from "@/db/connectDB";
import { userModelToUserDto } from "./utils";
import User from "@/db/(models)/User";

import type { UserDto } from "@/use-cases/user/types";

async function createNewEmailUser(values: {
  name: string;
  email: string;
  password: string;
  role: string;
  firstLogIn: boolean;
}): Promise<UserDto> {
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  try {
    const user = await User.create(values);

    return userModelToUserDto(user);
  } catch (error) {
    throw new Error(
      "Error creating user for:" + values.email + ".  Error:" + error
    );
  }
}

export default createNewEmailUser;
