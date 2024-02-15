import { ProjectEntity } from "@/entities/Project";
import { CreateNewProject } from "@/use-cases/project/types";

import { GetUser } from "@/use-cases/user/types";
import { projectToCreateProjectDto } from "@/use-cases/project/utils";

// to be sorted out with how to update team and user and impliment
export async function createNewProjectUseCase(
  context: {
    createNewProject: CreateNewProject;
    getUser: GetUser;
  },
  data: {
    name: string;
    description: string;
    teamId: string;
  }
) {
  const user = context.getUser();
  if (!user) throw new Error("User not found");

  const newProject = new ProjectEntity({
    name: data.name,
    description: data.description,
    members: [user.userId],
    tasks: [],
    team: data.teamId,
  });
  await context.createNewProject(projectToCreateProjectDto(newProject));
}
