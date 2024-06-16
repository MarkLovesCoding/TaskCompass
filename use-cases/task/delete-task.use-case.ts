import { taskToDto } from "@/use-cases/task/utils";
import { TaskEntity, TaskEntityValidationError } from "@/entities/Task";
import { ProjectEntity, ProjectEntityValidationError } from "@/entities/Project";
import { AuthenticationError, ValidationError } from "../utils";

import type { DeleteTask } from "@/use-cases/task/types";
import type { GetProject,UpdateProject } from "../project/types";
import type { GetUserSession } from "@/use-cases/user/types";
import { projectToDto } from "../project/utils";

export async function deleteTaskUseCase(
  context: {
    deleteTask: DeleteTask;
    getProject: GetProject;
    updateProject: UpdateProject;
    getUser: GetUserSession;
  },
  data: {
    taskId: string;
    projectId: string;
  }
) {
  const user = context.getUser();
  if (!user) throw new AuthenticationError();

  try {
    const retrievedProject = await context.getProject(data.projectId);
    const projectAsEntity = new ProjectEntity({ ...retrievedProject });

    projectAsEntity.removeTask(data.taskId);
    
    await context.updateProject(projectToDto(projectAsEntity));


  } catch (err) {

    const error = err as ProjectEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
  try {
    await context.deleteTask(data.taskId);
  } catch (err : any) {
    if (typeof err.message === 'string') {
      throw new Error("Error deleting task: " +data.taskId +". Error:"+ err.message);
    }
    else{
      throw new Error("Error deleting task: " +data.taskId);
    }
  }
}
