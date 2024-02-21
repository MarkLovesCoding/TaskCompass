import { TaskEntity } from "@/entities/Task";
// import { UserEntity } from "@/entities/User";
import { UpdateTask, GetTask, UpdateTaskUsers } from "@/use-cases/task/types";
import { GetUser } from "@/use-cases/user/types";
import { taskToDto } from "@/use-cases/task/utils";

export async function updateTaskUsersUseCase(
  context: {
    updateTask: UpdateTask;
    getTask: GetTask;
    getUser: GetUser;
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
  const initialAssignees = task.getAssignees();
  task.addAssignees(data.addedAssignees);
  task.removeAssignees(data.removedAssignees);

  await context.updateTask(taskToDto(task));
  await context.updateTaskUsers(
    data.taskId,
    data.removedAssignees,
    data.addedAssignees
  );
}
