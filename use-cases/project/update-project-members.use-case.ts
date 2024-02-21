import { ProjectEntity } from "@/entities/Project";

import { GetUser } from "@/use-cases/user/types";
import { GetProject, UpdateProject, UpdateProjectMembers } from "./types";
import { projectToDto } from "./utils";

export async function updateProjectMembersUseCase(
  context: {
    updateProject: UpdateProject;
    updateProjectMembers: UpdateProjectMembers;
    getProject: GetProject;
    getUser: GetUser;
  },
  data: {
    projectId: string;
    updatedMembers: string[];
  }
) {
  const { userId } = context.getUser()!;
  if (!userId) throw new Error("User not found");

  const project = await context.getProject(data.projectId);
  const validatedProject = new ProjectEntity(project);
  // validatedProject.addMembers(data.addedMembers);
  // validatedProject.removeMembers(data.removedMembers);
  const initialMembers = validatedProject.getMembers();
  validatedProject.updateMembers(data.updatedMembers);

  console.log("updatedProject", validatedProject);
  await context.updateProject(projectToDto(validatedProject));
  await context.updateProjectMembers(
    data.projectId,
    initialMembers,
    data.updatedMembers
  );
}
