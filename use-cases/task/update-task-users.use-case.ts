import { TaskEntity } from "@/entities/Task";
import { UpdateTask, GetTask, UpdateTaskUsers } from "@/use-cases/task/types";
import { GetUserSession, UpdateUser } from "@/use-cases/user/types";

export async function updateTaskUsersUseCase(
  context: {
    updateTask: UpdateTask;
    getTask: GetTask;
    getUser: GetUserSession;
    updateTaskUsers: UpdateTaskUsers;
  },
  data: {
    taskId: string;
    addedAssignees: string[];
    removedAssignees: string[];
  }
) {
  const user = context.getUser();

  if (!user) throw new Error("User not found");

  const dataTask = await context.getTask(data.taskId);
  const task = new TaskEntity(dataTask);

  task.addAssignees(data.addedAssignees);
  task.removeAssignees(data.removedAssignees);

  // await context.updateTask(taskToDto(task));
  await context.updateTaskUsers(
    data.taskId,
    data.removedAssignees,
    data.addedAssignees
  );

  data.addedAssignees.forEach((assignee) => {});
}
