import "server-only";

import connectDB from "@/db/connectDB";

import User from "@/db/(models)/User";

import { UserDto } from "@/use-cases/user/types";

type UserModelType = {
  _id: string;
  name: string;
  email: string;
  projects: string[];
  teams: string[];
  tasks: string[];
  avatar: string;
};
export function userToUserDto(user: UserModelType): UserDto {
  console.log("USER__________________: ", user);
  console.log("USER TEAMS: ", user.teams);
  console.log("USER Project: ", user.projects);
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    projects: user.projects,
    teams: user.teams,
    tasks: user.tasks,
    avatar: user.avatar,
  };
}
// May require refactpr to get by ID
async function getUser(userId: string): Promise<UserDto> {
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
    console.log("USER RETRIEVED: ", userToUserDto(user));
    return userToUserDto(user);
  } catch (error) {
    throw new Error("Error retrieving user:" + error);
  }
}

export default getUser;
