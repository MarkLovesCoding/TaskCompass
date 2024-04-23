import { AuthenticationError } from "../utils";
import type { UpdateProjectColumnOrder } from "@/use-cases/project/types";
import type { GetUserSession } from "@/use-cases/user/types";

export async function updateProjectColumnOrderUseCase(
  context: {
    updateProjectColumnOrder: UpdateProjectColumnOrder;
    getUser: GetUserSession;
  },
  data: {
    projectId: string;
    type: string;
    columnOrder: string[];
  }
) {
  const user = context.getUser();
  if (!user) throw new AuthenticationError();

  try {
    await context.updateProjectColumnOrder(
      data.projectId,
      data.type,
      data.columnOrder
    );
  } catch (err) {
    throw new Error("Error updating project column order. Please try again.");
  }
}
