"use server";
import { createNewTask } from "@/data-access/tasks/create-new-task.persistence";
import { createNewTaskUseCase } from "@/use-cases/task/create-new-task.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { revalidatePath } from "next/cache";

type FormData = {
  name: string;
  description: string;
  project: string;
  assignees: string[];
  dueDate?: Date | undefined;
  startDate: Date;
  complete: boolean;
  category: string;
  priority: string;
  status: string;
  label?: string | undefined;
};

export async function createNewTaskAction(formData: FormData) {
  console.log("formData", formData);
  const { getUser } = await getUserFromSession();

  try {
    await createNewTaskUseCase(
      {
        createNewTask,
        getUser,
      },
      {
        name: formData.name,
        description: formData.description,
        project: formData.project,
        assignees: formData.assignees,
        dueDate: formData.dueDate,
        startDate: formData.startDate,
        complete: formData.complete,
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        label: formData.label,
      }
    );
    revalidatePath("/PROJECTS-CLEAN/[slug]");
    return {
      name: "New Task",
      description: "Task Description",
      project: formData.project,
      assignees: [],
      startDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      complete: false,
      category: "Personal",
      priority: "Medium",
      status: "To Do",
      label: "",
    };
  } catch (error: any) {
    console.error(error);
  }
}
