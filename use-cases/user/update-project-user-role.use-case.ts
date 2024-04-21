import { UserEntity } from "@/entities/User";
import { GetUser, GetUserSession, UpdateUser } from "@/use-cases/user/types";
import { userToDto } from "./utils";
import { GetProject } from "../project/types";
import { ProjectEntity } from "@/entities/Project";
export async function updateProjectUserRoleUseCase(
  context: {
    getProject: GetProject;
    updateUser: UpdateUser;
    getUser: GetUserSession;
    getUserObject: GetUser;
  },
  data: {
    projectId: string;
    updateType: "admin" | "member";
    projectUserId: string;
  }
) {
  const { userId } = context.getUser()!;
  if (!userId) throw new Error("User not found");
  const project = await context.getProject(data.projectId);
  const validatedProject = new ProjectEntity(project);
  const projectCreatedBy = validatedProject.getCreatedBy();
  if (projectCreatedBy == data.projectUserId)
    //figure out how to transfer this to toast
    throw new Error("Project Creator can't be changed");
  else {
    const projectUser = await context.getUserObject(data.projectUserId);
    const validatedProjectUser = new UserEntity(projectUser);
    validatedProjectUser.updateUserProjectPermissions(
      data.projectId,
      data.updateType
    );
    await context.updateUser(userToDto(validatedProjectUser));
  }
}
