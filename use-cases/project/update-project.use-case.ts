import { ProjectEntity } from "@/entities/Project";

import { GetUserSession } from "@/use-cases/user/types";
import { ProjectDto, UpdateProject, UpdateProjectUsers } from "./types";
import { projectToDto } from "./utils";

export async function updateProjectUseCase(
  context: {
    updateProject: UpdateProject;
    getUser: GetUserSession;
  },
  data: {
    project: ProjectDto;
  }
) {
  const { userId } = context.getUser()!;
  if (!userId) throw new Error("User not found");

  const validatedProject = new ProjectEntity(data.project);
  // validatedProject.addMembers(data.addedMembers);
  // validatedProject.removeMembers(data.removedMembers);

  console.log("updatedProject", validatedProject);
  await context.updateProject(projectToDto(validatedProject));
  // await context.updateManyProjectUsers(
  //   data.projectId,
  //   initialUsers,
  //   data.updatedUsers
  // );
}
