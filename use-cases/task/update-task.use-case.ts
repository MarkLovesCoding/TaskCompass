import { TaskEntity } from "@/entities/Task";
import { UpdateTask, GetTask } from "@/use-cases/task/types";
import { GetUser } from "@/use-cases/user/types";
import { taskToDto } from "@/use-cases/task/utils";

export async function updateTaskUseCase(
  context: {
    updateTask: UpdateTask;
    getTask: GetTask;
    getUser: GetUser;
  },
  data: {
    id: string;
    project: string;
    assignees: string[];
    dueDate?: Date | undefined;
    startDate: Date;
    category: string;
    complete: boolean;
    priority: string;
    status: string;
    label?: string | undefined;
  }
) {
  const user = context.getUser();
  if (!user) throw new Error("User not found");
  const task = await context.getTask(data.id);
  if (!task) throw new Error("Task not found");
  const taskAsEntity = new TaskEntity({
    ...task,
    project: data.project,
    assignees: data.assignees,
    dueDate: data.dueDate,
    startDate: data.startDate,
    complete: data.complete,
    category: data.category,
    priority: data.priority,
    status: data.status,
    label: data.label,
  });
  console.log("updatedTaskEntity", taskAsEntity);
  await context.updateTask(taskToDto(taskAsEntity));
}
