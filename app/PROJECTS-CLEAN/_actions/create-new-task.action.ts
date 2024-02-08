"use server";
import { createNewTask } from "@/data-access/tasks/create-new-task.persistence";
import { updateProject } from "@/data-access/projects/update-project.persistence";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { createNewTaskUseCase } from "@/use-cases/task/create-new-task.use-case";

type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    image: undefined;
    role: string;
  };
};
type FormData = {
  name: string;
  description: string;
  project: string;
  assignees: string[];
  dueDate?: number;
  startDate: number;
  complete: boolean;
  priority: string;
  status: string;
  label: string;
};

export async function createNewTaskAction(
  formData: FormData
): Promise<FormData> {
  //   const newTask = await createNewTask(formData);
  //   const project = await updateProject(newTask.project);
  const session: Session | null = await getServerSession(options);
  const user = session?.user.id;
  if (!user) throw new Error("User not found");

  const submittedForm = {
    name: formData.name,
    description: formData.description,
    project: formData.project,
    assignees: formData.assignees,
    dueDate: formData.dueDate,
    startDate: formData.startDate,
    complete: formData.complete,
    priority: formData.priority,
    status: formData.status,
    label: formData.label,
  };
  await createNewTaskUseCase(
    {
      createNewTask: createNewTask,
      updateProject: updateProject,
    },
    {
      name: submittedForm.name,
      description: submittedForm.description,
      project: submittedForm.project,
      assignees: submittedForm.assignees,
      dueDate: submittedForm.dueDate,
      startDate: submittedForm.startDate,
      complete: submittedForm.complete,
      priority: submittedForm.priority,
      status: submittedForm.status,
      label: submittedForm.label,
    }
  );
  return {
    name: "",
    description: "",
    project: formData.project,
    assignees: [],
    startDate: Date.now(),
    complete: false,
    priority: "",
    status: "",
    label: "",
  };

  //   return project;
}
