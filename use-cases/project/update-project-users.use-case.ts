import { ProjectEntity } from "@/entities/Project";
import { GetUserSession } from "@/use-cases/user/types";
import { GetProject, UpdateProject, UpdateProjectUsers } from "./types";
import { projectToDto } from "./utils";
import { AuthenticationError } from "../utils";

export async function updateProjectUsersUseCase(
  context: {
    updateProject: UpdateProject;
    updateManyProjectUsers: UpdateProjectUsers;
    getProject: GetProject;
    getUser: GetUserSession;
  },
  data: {
    projectId: string;
    updatedUsers: string[];
  }
) {
  const user = context.getUser()!;
  if (!user) throw new AuthenticationError();

  const project = await context.getProject(data.projectId);
  const validatedProject = new ProjectEntity(project);
  validatedProject.updateUsers(data.updatedUsers);
  const updatedproject = projectToDto(validatedProject);
  await context.updateProject(updatedproject);
  await context.updateManyProjectUsers(
    data.projectId,
    project.users,
    updatedproject.users
  );
}
