import { ProjectEntity } from "@/entities/Project";
import { UpdateProject, GetProject } from "@/use-cases/project/types";

import { GetUser } from "@/use-cases/user/types";
import { projectToDto } from "@/use-cases/project/utils";

// to be sorted out with how to update team and user and impliment
export async function updateProjectArchivedUseCase(
  context: {
    updateProject: UpdateProject;
    getProject: GetProject;
    getUser: GetUser;
  },
  data: {
    archived: boolean;
    projectId: string;
  }
) {
  const user = context.getUser();
  if (!user) throw new Error("User not found");
  const project = await context.getProject(data.projectId);
  if (!project) throw new Error("Project not found");
  const validatedProject = new ProjectEntity({
    ...project,
  });

  validatedProject.updateArchived(data.archived);
  console.log(
    "-----------------------------validatedProject",
    validatedProject
  );
  await context.updateProject(projectToDto(validatedProject));
}
