import { projectToDto } from "./utils";
import {
  ProjectEntity,
  ProjectEntityValidationError,
} from "@/entities/Project";
import { AuthenticationError, ValidationError } from "../utils";

import type { GetUserSession } from "@/use-cases/user/types";
import type { ProjectDto, UpdateProject } from "./types";

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
