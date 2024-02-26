import "server-only";

import connectDB from "@/db/connectDB";

import User from "@/db/(models)/User";

import { UserDto } from "@/use-cases/user/types";
import { userModelToUserDto } from "./utils";

// May require refactpr to get by ID
async function getUserObject(userId: string): Promise<UserDto> {
  // console.log("asdfasdfasfdasdf>>>>>>>>>>>>getUserObject userId", userId);
  try {
    await connectDB();
  } catch (error) {
    // Handle connectDB error
    throw new Error("Error connecting to the database:" + error);
  }

  // const userId = user.id;
  try {
    // Find the user by ID
    const user = await User.findById(userId);
    console.log("user RETRIEVED: ", user);

    console.log("USER RETRIEVED: ", userModelToUserDto(user));
    console.log(
      "USER RETRIEVED projectsAsAdmin: ",
      userModelToUserDto(user).projectsAsAdmin
    );
    return userModelToUserDto(user);
  } catch (error) {
    throw new Error("Error retrieving user:" + error);
  }
}

export default getUserObject;
