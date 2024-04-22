import { GetProject, UpdateProject } from "@/use-cases/project/types";
import { GetUserSession } from "@/use-cases/user/types";
import {
  ProjectEntity,
  ProjectEntityValidationError,
} from "@/entities/Project";
import { projectToDto } from "./utils";
import { AuthenticationError, ValidationError } from "../utils";

export async function updateProjectTasksOrderFromTaskCardUseCase(
  context: {
    updateProject: UpdateProject;
    getProject: GetProject;
    getUser: GetUserSession;
  },
  data: {
    projectId: string;
    taskId: string;
    taskOrderChanges: Record<string, string>;
  }
) {
  const user = context.getUser();
  if (!user) throw new AuthenticationError();

  const project = await context.getProject(data.projectId);
  if (!project) throw new Error("Project not found");

  try {
    const projectAsEntity = new ProjectEntity({ ...project });
    const { type, newSubType, existingSubType } = data.taskOrderChanges;
    projectAsEntity.updateTasksOrder(
      data.taskId,
      type,
      newSubType,
      existingSubType
    );
    await context.updateProject(projectToDto(projectAsEntity));
  } catch (err) {
    const error = err as ProjectEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
