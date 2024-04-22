import {
  ProjectEntity,
  ProjectEntityValidationError,
} from "@/entities/Project";
import { GetUserSession } from "@/use-cases/user/types";
import { ProjectDto, UpdateProject } from "./types";
import { projectToDto } from "./utils";
import { AuthenticationError, ValidationError } from "../utils";

export async function updateProjectUseCase(
  context: {
    updateProject: UpdateProject;
    getUser: GetUserSession;
  },
  data: {
    project: ProjectDto;
  }
) {
  const user = context.getUser()!;
  if (!user) throw new AuthenticationError();

  try {
    const validatedProject = new ProjectEntity(data.project);
    await context.updateProject(projectToDto(validatedProject));
  } catch (err) {
    const error = err as ProjectEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
