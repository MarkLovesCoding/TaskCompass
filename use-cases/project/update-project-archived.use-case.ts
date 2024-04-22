import {
  ProjectEntity,
  ProjectEntityValidationError,
} from "@/entities/Project";
import { UpdateProject, GetProject } from "@/use-cases/project/types";
import { GetUserSession } from "@/use-cases/user/types";
import { projectToDto } from "@/use-cases/project/utils";
import { AuthenticationError, ValidationError } from "../utils";

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
