import { UserEntity } from "@/entities/User";
import { GetUser, GetUserSession, UpdateUser } from "@/use-cases/user/types";
import { userToDto } from "./utils";
import { ProjectEntity } from "@/entities/Project";
import { GetProject, UpdateProject } from "../project/types";
import { projectToDto } from "../project/utils";

export async function removeProjectUserUseCase(
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
  const { userId } = context.getUser()!;
  if (!userId) throw new Error("User not found");
  //update Team
  const retrievedProject = await context.getProject(data.projectId);
  const validatedProject = new ProjectEntity(retrievedProject);
  validatedProject.removeUser(data.projectUserId);
  const updatedProject = projectToDto(validatedProject);
  await context.updateProject(updatedProject);

  //update User
  const projectUser = await context.getUserObject(data.projectUserId);
  const validatedProjectUser = new UserEntity(projectUser);
  validatedProjectUser.removeProjectAsAdmin(data.projectId);
  validatedProjectUser.removeProjectAsMember(data.projectId);
  await context.updateUser(userToDto(validatedProjectUser));
}
