import { ProjectEntity } from "@/entities/Project";

import { GetUserSession } from "@/use-cases/user/types";
import { GetProject, UpdateProject, UpdateProjectUsers } from "./types";
import { projectToDto } from "./utils";

export async function updateProjectUsersUseCase(
  context: {
    updateProject: UpdateProject;
    updateManyProjectUsers: UpdateProjectUsers;
    getProject: GetProject;
    getUser: GetUserSession;
  },
  data: {
    projectId: string;
    updatedUsers: string[];
  }
) {
  const { userId } = context.getUser()!;
  if (!userId) throw new Error("User not found");

  const project = await context.getProject(data.projectId);
  const validatedProject = new ProjectEntity(project);
  validatedProject.updateUsers(data.updatedUsers);

  await context.updateProject(projectToDto(validatedProject));
}
