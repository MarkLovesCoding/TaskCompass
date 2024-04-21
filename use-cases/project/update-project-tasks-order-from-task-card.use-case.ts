import { GetProject, UpdateProject } from "@/use-cases/project/types";
import { GetUserSession } from "@/use-cases/user/types";
import { ProjectEntity } from "@/entities/Project";
import { projectToDto } from "./utils";
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
  if (!user) throw new Error("User not found");
  //perform validation on data access layer to prevent many db calls
  const project = await context.getProject(data.projectId);
  const projectAsEntity = new ProjectEntity({ ...project });
  const { type, newSubType, existingSubType } = data.taskOrderChanges;
  projectAsEntity.updateTasksOrder(
    data.taskId,
    type,
    newSubType,
    existingSubType
  );
  await context.updateProject(projectToDto(projectAsEntity));
}
