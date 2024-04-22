import { UserEntity } from "@/entities/User";
import { GetUser, GetUserSession, UpdateUser } from "@/use-cases/user/types";
import { userToDto } from "./utils";
import { ProjectEntity } from "@/entities/Project";
import { GetProject, UpdateProject } from "../project/types";
import { projectToDto } from "../project/utils";
import { AuthenticationError } from "../utils";
export async function addProjectUserUseCase(
  context: {
    getProject: GetProject;
    updateProject: UpdateProject;
    updateUser: UpdateUser;
    getUser: GetUserSession;
    getUserObject: GetUser;
  },
  data: {
    projectId: string;
    projectUserId: string;
  }
) {
  const user = context.getUser()!;
  if (!user) throw new AuthenticationError();

  //update Team
  const retrievedProject = await context.getProject(data.projectId);
  const validatedProject = new ProjectEntity(retrievedProject);
  validatedProject.addUser(data.projectUserId);
  const updatedProject = projectToDto(validatedProject);
  await context.updateProject(updatedProject);

  //update User
  const projectUser = await context.getUserObject(data.projectUserId);
  const validatedProjectUser = new UserEntity(projectUser);
  validatedProjectUser.updateUserProjectPermissions(data.projectId, "member");
  await context.updateUser(userToDto(validatedProjectUser));
}
