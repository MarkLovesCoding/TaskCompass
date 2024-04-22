import { ProjectEntity } from "@/entities/Project";
import { GetUserSession } from "@/use-cases/user/types";
import { ProjectDto, UpdateProject } from "./types";
import { projectToDto } from "./utils";
import { AuthenticationError } from "../utils";

export async function updateProjectUseCase(
  context: {
    updateProject: UpdateProject;
    getUser: GetUserSession;
  },
  data: {
    project: ProjectDto;
  }
) {
  const user = context.getUser()!;
  if (!user) throw new AuthenticationError();

  const validatedProject = new ProjectEntity(data.project);
  await context.updateProject(projectToDto(validatedProject));
}
