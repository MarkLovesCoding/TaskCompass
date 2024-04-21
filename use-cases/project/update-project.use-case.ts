import { ProjectEntity } from "@/entities/Project";
import { GetUserSession } from "@/use-cases/user/types";
import { ProjectDto, UpdateProject } from "./types";
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
  await context.updateProject(projectToDto(validatedProject));
}
