import { projectToDto } from "@/use-cases/project/utils";
import {
  ProjectEntity,
  ProjectEntityValidationError,
} from "@/entities/Project";
import { AuthenticationError, ValidationError } from "../utils";

import type { GetUserSession } from "@/use-cases/user/types";
import type { UpdateProject, GetProject } from "@/use-cases/project/types";

export async function updateProjectDetailsUseCase(
  context: {
    updateProject: UpdateProject;
    getProject: GetProject;
    getUser: GetUserSession;
  },
  data: {
    name: string;
    description: string;
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

    validatedProject.updateName(data.name);
    validatedProject.updateDescription(data.description);

    await context.updateProject(projectToDto(validatedProject));
  } catch (err) {
    const error = err as ProjectEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
