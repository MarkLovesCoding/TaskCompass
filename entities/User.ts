import { ZodError, z } from "zod";

type ValidatedFields =
  | "id"
  | "name"
  | "email"
  | "projects"
  | "teams"
  | "tasks"
  | "avatar"
  | "backgroundImage";

export class UserEntityValidationError extends Error {
  private errors: Record<ValidatedFields, string | undefined>;

  constructor(errors: Record<ValidatedFields, string | undefined>) {
    super("An error occured validating an user entity");
    this.errors = errors;
  }

  getErrors() {
    return this.errors;
  }
}

export class UserEntity {
  private id: string;
  private name: string;
  private email?: string;
  private avatar: string;
  private projectsAsAdmin: string[];
  private projectsAsMember: string[];
  private teamsAsAdmin: string[];
  private teamsAsMember: string[];
  private tasks: string[];
  private backgroundImage: string;

  constructor({
    id,
    name,
    email,
    avatar,
    projectsAsAdmin,
    projectsAsMember,
    teamsAsAdmin,
    teamsAsMember,
    tasks,
    backgroundImage,
  }: {
    id: string;
    name: string;
    email?: string;
    avatar: string;
    projectsAsAdmin: string[];
    projectsAsMember: string[];
    teamsAsAdmin: string[];
    teamsAsMember: string[];
    tasks: string[];
    backgroundImage: string;
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.avatar = avatar;
    this.projectsAsAdmin = projectsAsAdmin;
    this.projectsAsMember = projectsAsMember;
    this.teamsAsAdmin = teamsAsAdmin;
    this.teamsAsMember = teamsAsMember;
    this.tasks = tasks;
    this.backgroundImage = backgroundImage;
    this.validate();
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  getProjectsAsAdmin() {
    return this.projectsAsAdmin;
  }

  getProjectsAsMember() {
    return this.projectsAsMember;
  }

  getTeamsAsAdmin() {
    return this.teamsAsAdmin;
  }

  getTeamsAsMember() {
    return this.teamsAsMember;
  }

  getTasks() {
    return this.tasks;
  }

  getId() {
    return this.id;
  }

  getAvatar() {
    return this.avatar;
  }
  getBackgroundImage() {
    return this.backgroundImage;
  }

  addProjectAsAdmin(project: string) {
    this.projectsAsAdmin.push(project);
  }

  removeProjectAsAdmin(project: string) {
    this.projectsAsAdmin = this.projectsAsAdmin.filter((p) => p !== project);
  }

  addTeamAsAdmin(team: string) {
    this.teamsAsAdmin.push(team);
  }

  removeTeamAsAdmin(team: string) {
    this.teamsAsAdmin = this.teamsAsAdmin.filter((t) => t !== team);
  }

  addProjectAsMember(project: string) {
    this.projectsAsMember.push(project);
  }

  removeProjectAsMember(project: string) {
    this.projectsAsMember = this.projectsAsMember.filter((p) => p !== project);
  }

  addTeamAsMember(team: string) {
    this.teamsAsMember.push(team);
  }

  removeTeamAsMember(team: string) {
    this.teamsAsMember = this.teamsAsMember.filter((t) => t !== team);
  }

  addTask(task: string) {
    this.tasks.push(task);
  }

  removeTask(task: string) {
    this.tasks = this.tasks.filter((t) => t !== task);
  }

  updateAvatar(avatar: string) {
    this.avatar = avatar;
  }
  updateBackgroundImage(backgroundImage: string) {
    this.backgroundImage = backgroundImage;
  }

  updateUserProjectPermissions(
    projectId: string,
    updateType: "admin" | "member"
  ) {
    if (
      updateType === "admin" &&
      !this.getProjectsAsAdmin().includes(projectId)
    ) {
      this.addProjectAsAdmin(projectId);
      this.removeProjectAsMember(projectId);
    } else if (
      updateType === "member" &&
      !this.getProjectsAsMember().includes(projectId)
    ) {
      this.addProjectAsMember(projectId);
      this.removeProjectAsAdmin(projectId);
    } else {
      throw new Error("Invalid update type");
    }
  }
  updateUserTeamPermissions(teamId: string, updateType: "admin" | "member") {
    if (updateType === "admin" && !this.getTeamsAsAdmin().includes(teamId)) {
      this.addTeamAsAdmin(teamId);
      this.removeTeamAsMember(teamId);
    } else if (
      updateType === "member" &&
      !this.getTeamsAsMember().includes(teamId)
    ) {
      this.addTeamAsMember(teamId);
      this.removeTeamAsAdmin(teamId);
    } else {
      throw new Error("Invalid update type");
    }
  }

  private validate() {
    const projectSchema = z.object({
      name: z.string().min(3).max(30),
      email: z.string().email(),
      projects: z.array(z.string()).optional(),
      teams: z.array(z.string()).optional(),
      tasks: z.array(z.string()).optional(),
      avatar: z.string().min(0),
      backgroundImage: z.string().optional(),
    });
    try {
      projectSchema.parse(this);
    } catch (err) {
      const error = err as ZodError;
      const errors = error.flatten().fieldErrors;
      throw new UserEntityValidationError({
        id: errors.id?.[0],
        name: errors.name?.[0],
        email: errors.email?.[0],
        projects: errors.projects?.[0],
        teams: errors.teams?.[0],
        tasks: errors.tasks?.[0],
        avatar: errors.avatar?.[0],
        backgroundImage: errors.backgroundImage?.[0],
      });
    }
  }
}
