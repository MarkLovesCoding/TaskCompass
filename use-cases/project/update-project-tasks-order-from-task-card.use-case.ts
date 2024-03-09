import { TaskEntity } from "@/entities/Task";
import {
  GetTask,
  TaskDto,
  UpdateTasksOrderInLists,
} from "@/use-cases/task/types";
import {
  GetProject,
  ProjectDto,
  UpdateProject,
  UpdateTasksOrderFromTaskCard,
} from "@/use-cases/project/types";
import { GetUserSession } from "@/use-cases/user/types";
import { taskToDto } from "@/use-cases/task/utils";
import { OrderInLists } from "@/use-cases/task/types";
import { TasksOrder } from "@/use-cases/project/types";
import { ProjectEntity } from "@/entities/Project";
import { projectModelToProjectDto } from "@/data-access/projects/utils";
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
  // const retrievedTask = await context.getTask(data.id);

  // const taskAsEntity = new TaskEntity({ ...retrievedTask });

  // console.log("updatedTaskEntity w name", taskAsEntity);
  //perform validation on data access layer to prevent many db calls
  const project = await context.getProject(data.projectId);
  const projectAsEntity = new ProjectEntity({ ...project });
  console.log("data.taskOrderChanges", data.taskOrderChanges);
  const { type, newSubType, existingSubType } = data.taskOrderChanges;
  projectAsEntity.updateTasksOrder(
    data.taskId,
    type,
    newSubType,
    existingSubType
  );
  await context.updateProject(projectToDto(projectAsEntity));
}
