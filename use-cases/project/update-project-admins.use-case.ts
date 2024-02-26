import { ProjectEntity } from "@/entities/Project";

import { GetUserSession } from "@/use-cases/user/types";
import { GetProject, UpdateProject, UpdateProjectAdmins } from "./types";
import { projectToDto } from "./utils";

export async function updateProjectAdminsUseCase(
  context: {
    updateProject: UpdateProject;
    updateManyProjectAdmins: UpdateProjectAdmins;
    getProject: GetProject;
    getUser: GetUserSession;
  },
  data: {
    projectId: string;
    updatedAdmins: string[];
  }
) {
  const { userId } = context.getUser()!;
  if (!userId) throw new Error("User not found");

  const project = await context.getProject(data.projectId);
  const validatedProject = new ProjectEntity(project);
  // validatedProject.addAdmins(data.addedAdmins);
  // validatedProject.removeAdmins(data.removedAdmins);
  const initialAdmins = validatedProject.getAdmins();
  validatedProject.updateAdmins(data.updatedAdmins);

  console.log("updatedProject", validatedProject);
  await context.updateProject(projectToDto(validatedProject));
  await context.updateManyProjectAdmins(
    data.projectId,
    initialAdmins,
    data.updatedAdmins
  );
}
