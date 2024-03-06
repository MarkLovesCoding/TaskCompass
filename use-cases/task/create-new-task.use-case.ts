import { TaskEntity } from "@/entities/Task";
import { CreateTask } from "@/use-cases/task/types";
import { GetUserSession } from "@/use-cases/user/types";
import { taskToCreateTaskDto } from "@/use-cases/task/utils";

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
  if (!user) throw new Error("User not found");

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
    orderInLists: {
      priority: ["Medium", 0],
      status: ["Not Started", 0],
      category: ["Other", 0],
    },
  });

  await context.createNewTask(taskToCreateTaskDto(newTask));
}
