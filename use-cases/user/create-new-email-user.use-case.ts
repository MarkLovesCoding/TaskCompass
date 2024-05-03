import bcrypt from "bcrypt";

import { userToDto } from "./utils";
import { teamToCreateTeamDto, teamToDto } from "../team/utils";
import { UserEntity, UserEntityValidationError } from "@/entities/User";
import { TeamEntity, TeamEntityValidationError } from "@/entities/Team";
import {
  ProjectEntity,
  ProjectEntityValidationError,
} from "@/entities/Project";
import { projectToCreateProjectDto, projectToDto } from "../project/utils";

import type { CreateNewEmailUser, UpdateUser } from "./types";
import type {
  UpdateProject,
  CreateDefaultProject,
  ProjectDto,
} from "../project/types";
import type { UpdateTeam, CreateDefaultTeam } from "../team/types";
import { ValidationError } from "../utils";

//******************************************
//This function creates new user from email,
//then sets up default teams and projects for the user
//******************************************
export async function createNewEmailUserUseCase(
  context: {
    createDefaultTeam: CreateDefaultTeam;
    createNewEmailUser: CreateNewEmailUser;
    createDefaultProject: CreateDefaultProject;
    updateUser: UpdateUser;
    updateTeam: UpdateTeam;
    updateProject: UpdateProject;
  },
  data: {
    values: {
      name: string;
      email: string;
      password: string;
      passwordConfirm: string;
      role: string;
      firstLogIn: boolean;
    };
  }
) {
  //****************************************
  // Check if team exists
  // Retrieve Team Entity & Gather Team and Invite Data
  //
  const hashPassword: string = await bcrypt.hash(data.values.password, 12);

  let newUser = await context.createNewEmailUser({
    name: data.values.name,
    email: data.values.email,
    password: hashPassword,
    role: data.values.role,
    firstLogIn: data.values.firstLogIn,
  });

  if (!newUser) throw new Error("Error creating user");

  // If user is created, create default team and project
  if (newUser) {
    const newUserId: string = newUser.id;
    const newTeamData = {
      name: `${newUser.name}'s First Team`,
      users: [newUserId],
      projects: [],
      createdBy: newUserId,
      backgroundImage: "",
      backgroundImageThumbnail: "",
      invitedUsers: [],
    };
    const newTeam = new TeamEntity({
      ...newTeamData,
    });

    let initialTeamAssigned = await context.createDefaultTeam(
      teamToCreateTeamDto(newTeam)
    );

    if (!initialTeamAssigned) throw new Error("Error creating default team");

    // Create default project object
    const newProjectData = {
      name: `${newUser.name}'s First Project`,
      description: "",
      archived: false,
      createdBy: newUser.id,
      users: [newUser.id],
      team: initialTeamAssigned.id,
      tasks: [],
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
      backgroundImage: "",
      backgroundImageThumbnail: "",
    };

    //create project entity
    let newProject,
      newUserEntity,
      initialProjectEntity,
      initialTeamEntity,
      initialProjectAssigned;

    try {
      newProject = new ProjectEntity({ ...newProjectData });
    } catch (err) {
      const error = err as ProjectEntityValidationError;
      throw new ValidationError(error.getErrors());
    }
    try {
      //CREATE NEW PROJECT WITH FILLER NAMES
      initialProjectAssigned = await context.createDefaultProject(
        projectToCreateProjectDto(newProject)
      );
    } catch (error) {
      throw new Error("Error creating default project");
    }

    //establish entities
    try {
      newUserEntity = new UserEntity(newUser);
    } catch (err) {
      const error = err as UserEntityValidationError;
      throw new ValidationError(error.getErrors());
    }
    try {
      initialProjectEntity = new ProjectEntity(initialProjectAssigned);
    } catch (err) {
      const error = err as ProjectEntityValidationError;
      throw new ValidationError(error.getErrors());
    }
    try {
      initialTeamEntity = new TeamEntity(initialTeamAssigned);
    } catch (err) {
      const error = err as TeamEntityValidationError;
      throw new ValidationError(error.getErrors());
    }

    try {
      newUserEntity.addProjectAsAdmin(initialProjectAssigned.id);
      newUserEntity.addTeamAsAdmin(initialTeamAssigned.id);

      await context.updateUser(userToDto(newUserEntity));
    } catch (error) {
      throw new Error("Error updating user");
    }

    try {
      initialProjectEntity.setTeam(initialTeamAssigned.id);
      await context.updateProject(projectToDto(initialProjectEntity));
    } catch (error) {
      throw new Error("Error updating project");
    }

    try {
      initialTeamEntity.addProject(initialProjectAssigned.id);
      await context.updateTeam(teamToDto(initialTeamEntity));
    } catch (error) {
      throw new Error("Error updating team");
    }

    return;
  }
}
