import { UserEntity, UserEntityValidationError } from "@/entities/User";
import { GetUser, GetUserSession, UpdateUser } from "@/use-cases/user/types";
import { userToDto } from "./utils";
import {
  ProjectEntity,
  ProjectEntityValidationError,
} from "@/entities/Project";
import { GetProject, UpdateProject } from "../project/types";
import { projectToDto } from "../project/utils";
import { AuthenticationError, ValidationError } from "../utils";
export async function addProjectUserUseCase(
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
  try {
    const retrievedProject = await context.getProject(data.projectId);
    const validatedProject = new ProjectEntity(retrievedProject);
    validatedProject.addUser(data.projectUserId);
    const updatedProject = projectToDto(validatedProject);
    await context.updateProject(updatedProject);
  } catch (err) {
    const error = err as ProjectEntityValidationError;
    throw new ValidationError(error.getErrors());
  }

  //update User
  try {
    const projectUser = await context.getUserObject(data.projectUserId);
    const validatedProjectUser = new UserEntity(projectUser);
    validatedProjectUser.updateUserProjectPermissions(data.projectId, "member");
    await context.updateUser(userToDto(validatedProjectUser));
  } catch (err) {
    const error = err as UserEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
