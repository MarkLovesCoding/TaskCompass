import bcrypt from "bcrypt";

import { teamToDto } from "./utils";
import { userToDto } from "../user/utils";
import { UserEntity } from "@/entities/User";
import { TInvitedUser, TeamEntity } from "@/entities/Team";
import type { UpdateUser, CreateNewEmailUser } from "@/use-cases/user/types";
import type { GetTeam, UpdateTeam } from "./types";

//******************************************
//This function validates the invite token and sets up the user
//It also updates the team and user entities
//******************************************
export async function signUpNewUserAddToTeamUseCase(
  context: {
    getTeam: GetTeam;
    createNewEmailUser: CreateNewEmailUser;
    updateUser: UpdateUser;
    updateTeam: UpdateTeam;
  },
  data: {
    invitedUserData: TInvitedUser;
    values: {
      name: string;
      email: string;
      password: string;
      role: string;
      firstLogIn: boolean;
    };
  }
) {
  //****************************************
  // Check if team exists
  // Retrieve Team Entity & Gather Team and Invite Data
  //
  console.log(",,,,,,,,,,,,invitedData", data.invitedUserData);

  const getTeam = await context.getTeam(data.invitedUserData.teamId);
  if (!getTeam) throw new Error("Team not found");

  const teamName = getTeam.name;
  const teamId = data.invitedUserData.teamId;

  //CreateUser
  const hashPassword: string = await bcrypt.hash(data.values.password, 12);

  const createdUser = await context.createNewEmailUser({
    name: data.values.name,
    email: data.values.email,
    password: hashPassword,
    role: data.values.role,
    firstLogIn: data.values.firstLogIn,
  });
  if (!createdUser) throw new Error("Error creating user");

  //****************************************
  // Handle User Entity
  // const retrievedUser = await context.getUserByEmail(invitedUserData.email);
  // if (!retrievedUser) throw new Error("Error getting user by email");
  const userEntity = new UserEntity(createdUser);
  if (data.invitedUserData.role === "admin") {
    userEntity.addTeamAsAdmin(teamId);
  } else if (data.invitedUserData.role === "member") {
    userEntity.addTeamAsMember(teamId);
  }
  //****************************************
  // Handle Update User Entity
  try {
    await context.updateUser(userToDto(userEntity));
  } catch (error) {
    throw new Error("Error updating users teams");
  }

  //****************************************
  // Handle Update Team Entity
  const teamEntity = new TeamEntity(getTeam);
  teamEntity.addUser(createdUser.id);
  teamEntity.removeInvitedUser(data.invitedUserData);

  try {
    await context.updateTeam(teamToDto(teamEntity));
  } catch (error) {
    throw new Error("Error updating team");
  }

  //If no errors thrown, next stage in UI to sign in performed.
}
