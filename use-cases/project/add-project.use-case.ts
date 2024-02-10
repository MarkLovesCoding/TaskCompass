import { ProjectEntity } from "@/entities/Project";
import { projectToDto } from "@/use-cases/project/utils";

import { GetTeam, UpdateTeam } from "@/use-cases/team/types";
import { CreateProject, UpdateProject } from "@/use-cases/project/types";
import { GetUser, UpdateUser } from "@/use-cases/user/types";
export async function addProjectUseCase(
  context: {
    getUser: GetUser;
    getTeam: GetTeam;
    updateTeam: UpdateTeam;
    createProject: CreateProject;
    updateProject: UpdateProject;
    updateUser: UpdateUser;
  },
  data: {
    teamId: string;
    name: string;
    description: string;
  }
): Promise<void> {
  const user = context.getUser();
  if (!user) throw new Error("User not found");

  const newProject = new ProjectEntity({
    name: data.name,
    description: data.description,
    members: [user.userId],
    tasks: [],
  });
}
