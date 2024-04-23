"use server";
import { revalidatePath } from "next/cache";

import { getUserFromSession } from "@/lib/sessionAuth";
import { updateProjectColumnOrder } from "@/data-access/projects/update-project-column-order.persistence";
import { updateProjectColumnOrderUseCase } from "@/use-cases/project/update-project-column-order.use-case";
import { ValidationError } from "@/use-cases/utils";

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
  } catch (err) {
    const error = err as Error;
    if (error instanceof ValidationError) {
      throw new ValidationError(error.getErrors());
    } else {
      throw new Error(error.message);
    }
  }
}
