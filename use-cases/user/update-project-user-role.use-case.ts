import { ProjectEntity } from "@/entities/Project";

import { GetUser } from "@/use-cases/user/types";
import { GetProject, UpdateProject, UpdateProjectAdmins } from "./types";
import { projectToDto } from "./utils";

export async function updateProjectAdminsUseCase(
  context: {
    updateProject: UpdateProject;
    updateProjectAdmins: UpdateProjectAdmins;
    getProject: GetProject;
    getUser: GetUser;
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
  await context.updateProjectAdmins(
    data.projectId,
    initialAdmins,
    data.updatedAdmins
  );
}
