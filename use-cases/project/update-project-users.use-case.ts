import {
  ProjectEntity,
  ProjectEntityValidationError,
} from "@/entities/Project";
import { GetUserSession } from "@/use-cases/user/types";
import { GetProject, UpdateProject, UpdateProjectUsers } from "./types";
import { projectToDto } from "./utils";
import { AuthenticationError, ValidationError } from "../utils";

export async function updateProjectUsersUseCase(
  context: {
    updateProject: UpdateProject;
    updateManyProjectUsers: UpdateProjectUsers;
    getProject: GetProject;
    getUser: GetUserSession;
  },
  data: {
    projectId: string;
    updatedUsers: string[];
  }
) {
  const user = context.getUser()!;
  if (!user) throw new AuthenticationError();

  const project = await context.getProject(data.projectId);
  if (!project) throw new Error("Project not found");

  try {
    const validatedProject = new ProjectEntity(project);
    validatedProject.updateUsers(data.updatedUsers);
    const updatedproject = projectToDto(validatedProject);
    await context.updateProject(updatedproject);
    await context.updateManyProjectUsers(
      data.projectId,
      project.users,
      updatedproject.users
    );
  } catch (err) {
    const error = err as ProjectEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
