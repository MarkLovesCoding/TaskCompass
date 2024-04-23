import { projectToCreateProjectDto } from "@/use-cases/project/utils";
import {
  ProjectEntity,
  ProjectEntityValidationError,
} from "@/entities/Project";
import { AuthenticationError, ValidationError } from "../utils";

import type { CreateNewProject } from "@/use-cases/project/types";
import type { GetUserSession } from "@/use-cases/user/types";

export async function createNewProjectUseCase(
  context: {
    createNewProject: CreateNewProject;
    getUser: GetUserSession;
  },
  data: {
    name: string;
    description: string;
    teamId: string;
  }
) {
  const user = context.getUser();
  if (!user) throw new AuthenticationError();
  try {
    const newProject = new ProjectEntity({
      name: data.name,
      description: data.description,
      users: [user.userId],
      tasks: [],
      team: data.teamId,
      archived: false,
      backgroundImage: "",
      backgroundImageThumbnail: "",
      createdBy: user.userId,
      tasksOrder: {
        priority: { High: [], Medium: [], Low: [] },
        status: {
          "Not Started": [],
          "Up Next": [],
          "In Progress": [],
          Completed: [],
        },
        category: {
          Household: [],
          Personal: [],
          Work: [],
          School: [],
          Other: [],
        },
      },
      columnOrder: {
        priority: ["High", "Medium", "Low"],
        status: ["Not Started", "Up Next", "In Progress", "Completed"],
        category: ["Household", "Personal", "Work", "School", "Other"],
      },
    });
    await context.createNewProject(
      projectToCreateProjectDto(newProject),
      user.userId
    );
  } catch (err) {
    const error = err as ProjectEntityValidationError;
    throw new ValidationError(error.getErrors());
  }
}
