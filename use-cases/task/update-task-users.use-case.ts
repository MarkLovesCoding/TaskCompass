import { TaskEntity } from "@/entities/Task";
// import { UserEntity } from "@/entities/User";
import { UpdateTaskUsers } from "@/use-cases/task/types";
import { GetUser } from "@/use-cases/user/types";
import { taskToDto } from "@/use-cases/task/utils";

export async function updateTaskUsersUseCase(
  context: {
    updateTaskUsers: UpdateTaskUsers;

    getUser: GetUser;
  },
  data: {
    taskId: string;
    addedAssignees: string[];
    removedAssignees: string[];
  }
) {
  const user = context.getUser();
  if (!user) throw new Error("User not found");
  await context.updateTaskUsers(
    data.taskId,
    data.addedAssignees,
    data.removedAssignees
  );
}
