import { TaskEntity } from "@/entities/Task";
import { CreateTask } from "@/use-cases/task/types";
import { UpdateProject } from "@/use-cases/project/types";
import { taskToCreateTaskDto } from "@/use-cases/task/utils";

export async function createNewTaskUseCase(
  context: {
    createNewTask: CreateTask;
    updateProject: UpdateProject;
  },
  data: {
    name: string;
    description: string;
    project: string;
    assignees: string[];
    dueDate?: number;
    startDate: number;
    complete: boolean;
    priority: string;
    status: string;
    label: string;
  }
) {
  const newTask = new TaskEntity({
    name: data.name,
    description: data.description,
    project: data.project,
    assignees: data.assignees,
    dueDate: data.dueDate,
    startDate: data.startDate,
    complete: data.complete,
    priority: data.priority,
    status: data.status,
    label: data.label,
  });

  await context.createNewTask(taskToCreateTaskDto(newTask));
  //update project
}
