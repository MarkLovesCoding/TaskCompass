import { projectToDto } from "@/use-cases/project/utils";
import {
  ProjectEntity,
  ProjectEntityValidationError,
} from "@/entities/Project";
import { AuthenticationError, ValidationError } from "../utils";

import type { UpdateProject, GetProject } from "@/use-cases/project/types";
import type { GetUserSession } from "@/use-cases/user/types";

export async function updateProjectArchivedUseCase(
  context: {
    updateProject: UpdateProject;
    getProject: GetProject;
    getUser: GetUserSession;
  },
  data: {
    archived: boolean;
    projectId: string;
  }
) {
  const user = context.getUser();
  if (!user) throw new AuthenticationError();

  const project = await context.getProject(data.projectId);
  if (!project) throw new Error("Project not found");

  try {
    const validatedProject = new ProjectEntity({
      ...project,
    });
    validatedProject.updateArchived(data.archived);
    await context.updateProject(projectToDto(validatedProject));
  } catch (err) {
    const error = err as ProjectEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
