import { ProjectEntity } from "@/entities/Project";
import { UpdateProject, GetProject } from "@/use-cases/project/types";

import { GetUser } from "@/use-cases/user/types";
import { projectToDto } from "@/use-cases/project/utils";

// to be sorted out with how to update team and user and impliment
export async function updateProjectDetailsUseCase(
  context: {
    updateProject: UpdateProject;
    getProject: GetProject;
    getUser: GetUser;
  },
  data: {
    name: string;
    description: string;
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
  validatedProject.updateName(data.name);
  validatedProject.updateDescription(data.description);

  await context.updateProject(projectToDto(validatedProject));
}
