import { TaskEntity } from "@/entities/Task";
import { UpdateTaskFullCard, GetTask } from "@/use-cases/task/types";
import { GetUserSession } from "@/use-cases/user/types";
import { taskToDto } from "@/use-cases/task/utils";

export async function updateTaskFullCardUseCase(
  context: {
    updateTaskFullCard: UpdateTaskFullCard;

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
    // archived: boolean;
    priority: string;
    status: string;
    // orderInLists: { string: [string, number] };
    originalAssignees: string[];
    // label?: string | undefined;
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
    // archived: data.archived,
    category: data.category,
    priority: data.priority,
    status: data.status,
    // label: data.label,
  });
  // if(data.originalAssignees.length >0){
  const removedAssignees =
    data.originalAssignees.length > 0
      ? data.originalAssignees.filter(
          (assignee) => !data.assignees.includes(assignee)
        )
      : [];

  const addedAssignees =
    data.assignees.length > 0
      ? data.assignees.filter(
          (assignee) => !data.originalAssignees.includes(assignee)
        )
      : [];
  console.log("updatedTaskEntity", taskAsEntity);
  await context.updateTaskFullCard(
    taskToDto(taskAsEntity),
    removedAssignees,
    addedAssignees
  );
}