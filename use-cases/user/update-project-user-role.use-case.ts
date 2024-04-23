import { userToDto } from "./utils";
import { UserEntity } from "@/entities/User";
import {
  ProjectEntity,
  ProjectEntityValidationError,
} from "@/entities/Project";
import { AuthenticationError, ValidationError } from "../utils";

import type {
  GetUser,
  GetUserSession,
  UpdateUser,
} from "@/use-cases/user/types";
import type { GetProject } from "../project/types";

export async function updateProjectUserRoleUseCase(
  context: {
    getProject: GetProject;
    updateUser: UpdateUser;
    getUser: GetUserSession;
    getUserObject: GetUser;
  },
  data: {
    projectId: string;
    updateType: "admin" | "member";
    projectUserId: string;
  }
) {
  const user = context.getUser()!;
  if (!user) throw new AuthenticationError();

  const project = await context.getProject(data.projectId);
  if (!project) throw new Error("Project not found");

  try {
    const validatedProject = new ProjectEntity(project);
    const projectCreatedBy = validatedProject.getCreatedBy();
    if (projectCreatedBy == data.projectUserId)
      //figure out how to transfer this to toast
      throw new Error("Project Creator can't be changed");
    else {
      const projectUser = await context.getUserObject(data.projectUserId);
      const validatedProjectUser = new UserEntity(projectUser);
      validatedProjectUser.updateUserProjectPermissions(
        data.projectId,
        data.updateType
      );
      await context.updateUser(userToDto(validatedProjectUser));
    }
  } catch (err) {
    const error = err as ProjectEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
