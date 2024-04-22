import { ProjectEntity } from "@/entities/Project";
import { UpdateProject, GetProject } from "@/use-cases/project/types";
import { GetUserSession } from "@/use-cases/user/types";
import { projectToDto } from "@/use-cases/project/utils";
import { AuthenticationError } from "../utils";

export async function updateProjectArchivedUseCase(
  context: {
    updateProject: UpdateProject;
    getProject: GetProject;
    getUser: GetUserSession;
  },
  data: {
    archived: boolean;
    projectId: string;
  }
) {
  const user = context.getUser();
  if (!user) throw new AuthenticationError();
  const project = await context.getProject(data.projectId);
  if (!project) throw new Error("Project not found");
  const validatedProject = new ProjectEntity({
    ...project,
  });

  validatedProject.updateArchived(data.archived);
  await context.updateProject(projectToDto(validatedProject));
}
