import crypto from "crypto";

import { TInvitedUser, TeamEntity } from "@/entities/Team";
import { ValidationError } from "../utils";
import type {
  CreateNewEmailUser,
  GetUserByResetToken,
  UpdateUser,
} from "./types";
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
import { getUserByResetToken } from "@/data-access/users/get-user-by-reset-token.persistence";
import { User } from "lucide-react";
import { Resend } from "resend";

//******************************************
//This function impliments the forgot password use case,
//it uses the getUserByEmail and updateUser functions to find and update the user
//it sends an email to the user with a link to reset their password
//it also creates a reset token and expiry date for the user
//******************************************

export async function verifyResetTokenUseCase(
  context: {
    getUserByResetToken: GetUserByResetToken;
  },
  tokenData: {
    token: string;
  }
) {
  const hashedToken = crypto
    .createHash("sha256")
    .update(tokenData.token)
    .digest("hex");

  try {
    const validatedUser = await context.getUserByResetToken(hashedToken);
    return validatedUser;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
  //check if user exist}s
}
