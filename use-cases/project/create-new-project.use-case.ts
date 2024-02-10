import { ProjectEntity } from "@/entities/Project";
import { CreateProject, GetProject } from "@/use-cases/project/types";
import { GetUser } from "@/use-cases/user/types";
import { projectToCreateProjectDto } from "@/use-cases/project/utils";

export async function createNewProject(
  context: {
    createNewProject: CreateProject;
    getProject: GetProject;
    getUser: GetUser;
  },
  data: {
    name: string;
    description: string;
  }
) {
  const user = context.getUser();
  if (!user) throw new Error("User not found");

  const newProject = new ProjectEntity({
    name: data.name,
    description: data.description,
    members: [user.userId],
    tasks: [],
  });
  await context.createNewProject(projectToCreateProjectDto(newProject));
}
