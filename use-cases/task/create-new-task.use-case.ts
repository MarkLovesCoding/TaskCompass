import { TaskEntity, TaskEntityValidationError } from "@/entities/Task";
import { CreateTask } from "@/use-cases/task/types";
import { GetUserSession } from "@/use-cases/user/types";
import { taskToCreateTaskDto } from "@/use-cases/task/utils";
import { AuthenticationError, ValidationError } from "../utils";
export async function createNewTaskUseCase(
  context: {
    createNewTask: CreateTask;
    getUser: GetUserSession;
  },
  data: {
    name: string;
    project: string;
  }
) {
  const user = context.getUser();
  if (!user) throw new AuthenticationError();

  try {
    const newTask = new TaskEntity({
      name: data.name,
      description: "Task Description",
      project: data.project,
      assignees: [],
      startDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      archived: false,
      category: "Other",
      priority: "Medium",
      status: "Not Started",
    });

    await context.createNewTask(taskToCreateTaskDto(newTask));
  } catch (err) {
    const error = err as TaskEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
