import { TaskEntity } from "@/entities/Task";
import { UpdateTask } from "@/use-cases/task/types";
import { GetUser } from "@/use-cases/user/types";
import { taskToDto } from "@/use-cases/task/utils";

export async function updateTaskUseCase(
  context: {
    updateTask: UpdateTask;

    getUser: GetUser;
  },
  data: {
    id: string;
    name: string;
    description: string;
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

  const updatedTask = new TaskEntity({
    id: data.id,
    name: data.name,
    description: data.description,
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
  console.log("updatedTaskEntity", updatedTask);
  await context.updateTask(taskToDto(updatedTask));
}
