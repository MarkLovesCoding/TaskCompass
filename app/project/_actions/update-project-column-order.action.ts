"use server";
import { revalidatePath } from "next/cache";
import { updateProjectColumnOrder } from "@/data-access/projects/update-project-column-order.persistence";
import { getUserFromSession } from "@/lib/sessionAuth";
import { updateProjectColumnOrderUseCase } from "@/use-cases/project/update-project-column-order.use-case";
export async function updateProjectColumnOrderAction(
  projectId: string,
  type: string,
  columnOrder: string[]
) {
  const { getUser } = await getUserFromSession();
  try {
    await updateProjectColumnOrderUseCase(
      {
        updateProjectColumnOrder,
        getUser,
      },
      {
        projectId: projectId,
        type: type,
        columnOrder: columnOrder,
      }
    );

    revalidatePath(`/project/${projectId}`);

    //for toasts, not yet implemented
    // return { success: true };
  } catch (error: any) {
    console.error(error);
  }
}
