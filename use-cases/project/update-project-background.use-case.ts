import { ProjectEntity } from "@/entities/Project";
import { UpdateProject, GetProject } from "@/use-cases/project/types";
import { GetUserSession } from "@/use-cases/user/types";
import { projectToDto } from "@/use-cases/project/utils";

export async function updateProjectBackgroundUseCase(
  context: {
    updateProject: UpdateProject;
    getProject: GetProject;
    getUser: GetUserSession;
  },
  data: {
    projectId: string;
    projectBackgroundImage: string;
    projectBackgroundImageThumbnail: string;
  }
) {
  const user = context.getUser();
  if (!user) throw new Error("User not found");
  const project = await context.getProject(data.projectId);
  if (!project) throw new Error("Project not found");
  const validatedProject = new ProjectEntity({
    ...project,
  });

  validatedProject.updateBackgroundImage(data.projectBackgroundImage);
  validatedProject.updateBackgroundImageThumbnail(
    data.projectBackgroundImageThumbnail
  );
  await context.updateProject(projectToDto(validatedProject));
}
