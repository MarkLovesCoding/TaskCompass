import crypto from "crypto";

import { TInvitedUser, TeamEntity } from "@/entities/Team";
import { ValidationError } from "../utils";
import type { CreateNewEmailUser, GetUser, UpdateUser } from "./types";
import Project from "@/db/(models)/Project";
import Team from "@/db/(models)/Team";
import { ProjectEntity } from "@/entities/Project";
import { UpdateProject, CreateDefaultProject } from "../project/types";
import { projectToCreateProjectDto, projectToDto } from "../project/utils";
import { UpdateTeam, CreateDefaultTeam } from "../team/types";
import { UserEntity, UserEntityValidationError } from "@/entities/User";
import { userToDto } from "./utils";
import { teamToCreateTeamDto, teamToDto } from "../team/utils";
import bcrypt from "bcrypt";
import { getUserByEmail } from "@/data-access/users/get-user-by-email.persistence";
import { User } from "lucide-react";
import { Resend } from "resend";

//******************************************
//This function impliments the reset password use case,
//it uses the getUserObject and updateUser functions to get and update the user
//if validates the user and sets the password
//******************************************

export async function resetPasswordUseCase(
  context: {
    getUserObject: GetUser;
    updateUser: UpdateUser;
  },
  resetPasswordData: {
    values: {
      userId: string;
      password: string;
      passwordConfirm: string;
    };
  }
) {
  const { userId, password, passwordConfirm } = resetPasswordData.values;
  if (!password || !passwordConfirm) {
    throw new Error("Password and password confirm are required");
  }
  const existingUser = await context.getUserObject(userId);
  if (!existingUser) {
    throw new Error("User not found");
  }

  const hashPassword = await bcrypt.hash(password, 12);
  if (!hashPassword) {
    throw new Error("Password could not be hashed");
  }
  try {
    const validatedUser = new UserEntity(existingUser);
    validatedUser.setPassword(hashPassword);
    try {
      await context.updateUser(userToDto(validatedUser));
    } catch (err) {
      const error = err as Error;
      throw new Error(error.message);
    }
  } catch (err) {
    const error = err as UserEntityValidationError;
    throw new ValidationError(error.getErrors());
  }

  //check if user exists
}
