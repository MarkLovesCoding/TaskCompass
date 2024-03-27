import { TaskEntity } from "@/entities/Task";
import { UpdateTask, GetTask } from "@/use-cases/task/types";
import { GetUserSession } from "@/use-cases/user/types";
import { taskToDto } from "@/use-cases/task/utils";

export async function updateTaskUseCase(
  context: {
    updateTask: UpdateTask;

    getTask: GetTask;
    getUser: GetUserSession;
  },
  data: {
    id: string;
    name: string;
    description: string;
    project: string;
    assignees: string[];
    dueDate: Date;
    startDate: Date;
    category: string;
    priority: string;
    status: string;
    originalAssignees: string[];
  }
) {
  const user = context.getUser();
  if (!user) throw new Error("User not found");
  const task = await context.getTask(data.id);
  if (!task) throw new Error("Task not found");
  const taskAsEntity = new TaskEntity({
    ...task,
    project: data.project,
    name: data.name,
    description: data.description,
    assignees: data.assignees,
    dueDate: data.dueDate,
    startDate: data.startDate,
    category: data.category,
    priority: data.priority,
    status: data.status,
  });

  await context.updateTask(taskToDto(taskAsEntity));
}
