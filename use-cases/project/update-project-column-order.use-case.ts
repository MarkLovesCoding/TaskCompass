import { UpdateProjectColumnOrder } from "@/use-cases/project/types";
import { GetUserSession } from "@/use-cases/user/types";
import { AuthenticationError } from "../utils";

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
  await context.updateProjectColumnOrder(
    data.projectId,
    data.type,
    data.columnOrder
  );
}
