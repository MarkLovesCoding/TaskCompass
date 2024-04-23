import { userToDto } from "./utils";
import { projectToDto } from "../project/utils";
import { UserEntity, UserEntityValidationError } from "@/entities/User";
import {
  ProjectEntity,
  ProjectEntityValidationError,
} from "@/entities/Project";
import { AuthenticationError, ValidationError } from "../utils";

import type { GetProject, UpdateProject } from "../project/types";
import type {
  GetUser,
  GetUserSession,
  UpdateUser,
} from "@/use-cases/user/types";

export async function removeProjectUserUseCase(
  context: {
    getProject: GetProject;
    updateProject: UpdateProject;
    updateUser: UpdateUser;
    getUser: GetUserSession;
    getUserObject: GetUser;
  },
  data: {
    projectId: string;
    projectUserId: string;
  }
) {
  const user = context.getUser()!;
  if (!user) throw new AuthenticationError();
  //update Team
  const retrievedProject = await context.getProject(data.projectId);
  if (!retrievedProject) throw new Error("Project not found");

  try {
    const validatedProject = new ProjectEntity(retrievedProject);
    validatedProject.removeUser(data.projectUserId);
    const updatedProject = projectToDto(validatedProject);
    await context.updateProject(updatedProject);
  } catch (err) {
    const error = err as ProjectEntityValidationError;
    throw new ValidationError(error.getErrors());
  }

  //update User
  const projectUser = await context.getUserObject(data.projectUserId);
  if (!projectUser) throw new Error("User not found");

  try {
    const validatedProjectUser = new UserEntity(projectUser);
    validatedProjectUser.removeProjectAsAdmin(data.projectId);
    validatedProjectUser.removeProjectAsMember(data.projectId);
    await context.updateUser(userToDto(validatedProjectUser));
  } catch (err) {
    const error = err as UserEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
