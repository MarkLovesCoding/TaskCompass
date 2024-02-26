import { ProjectEntity } from "@/entities/Project";
import { UserEntity } from "@/entities/User";
import { GetUser, GetUserSession, UpdateUser } from "@/use-cases/user/types";
import { GetProject, UpdateProject } from "../project//types";
import { projectToDto } from "../project/utils";
import { userToDto } from "./utils";
export async function updateProjectUserRoleUseCase(
  context: {
    updateProject: UpdateProject;
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
  validatedProject.updateUserRole(data.projectUserId, data.updateType);
  // validatedProject.addAdmins(data.addedAdmins);
  // validatedProject.removeAdmins(data.removedAdmins);
  const projectUser = await context.getUserObject(data.projectUserId);
  const validatedProjectUser = new UserEntity(projectUser);
  validatedProjectUser.updateUserProjectPermissions(
    data.projectId,
    data.updateType
  );
  console.log("updatedProject", validatedProject);
  await context.updateProject(projectToDto(validatedProject));
  await context.updateUser(userToDto(validatedProjectUser));
}
