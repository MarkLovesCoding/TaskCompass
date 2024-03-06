"use server";
import { updateTask } from "@/data-access/tasks/update-task.persistence";
import { updateTaskOrderInLists } from "@/data-access/tasks/update-task-order-in-lists.persistence";
import getTask from "@/data-access/tasks/get-task.persistence";

import { updateTaskOrderInListsUseCase } from "@/use-cases/task/update-task-order-in-lists.use-case";
import { getUserFromSession } from "@/lib/sessionAuth";
import { revalidatePath } from "next/cache";
import { OrderInLists } from "@/use-cases/task/types";
type FormData = {
  id: string;
  projectId: string;
  orderInLists: OrderInLists;
  // label?: string | undefined;
};

export async function updateTaskOrderInListsAction(formData: FormData) {
  console.log("updatingformData", formData);
  const { getUser } = await getUserFromSession();

  try {
    await updateTaskOrderInListsUseCase(
      {
        updateTaskOrderInLists,
        getTask,
        getUser,
      },
      {
        id: formData.id,
        projectId: formData.projectId,
        orderInLists: formData.orderInLists,
        // label: formData.label,
      }
    );
    revalidatePath(`/PROJECTS-CLEAN/${formData.projectId}/page`);
    // revalidatePath("/PROJECTS-CLEAN/[slug]/page");
  } catch (error: any) {
    console.error(error);
  }
}
