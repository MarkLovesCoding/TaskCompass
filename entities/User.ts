import { ZodError, z } from "zod";

export class UserEntity {
  private id?: string;
  private name: string;
  private email: string;
  private avatar: string;
  private projects: string[];
  private teams: string[];
  private tasks: string[];

  constructor({
    id,
    name,
    email,
    avatar,
    projects,
    teams,
    tasks,
  }: {
    id?: string;
    name: string;
    email: string;
    avatar: string;
    projects: string[];
    teams: string[];
    tasks: string[];
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.avatar = avatar;
    this.projects = projects;
    this.teams = teams;
    this.tasks = tasks;
    this.validate();
  }

  getName() {
    return this.name;
  }
  getEmail() {
    return this.email;
  }
  getProjects() {
    return this.projects;
  }
  getTeams() {
    return this.teams;
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
  addProject(project: string) {
    this.projects.push(project);
  }
  removeProject(project: string) {
    this.projects = this.projects.filter((p) => p !== project);
  }

  addTeam(team: string) {
    this.teams.push(team);
  }
  removeTeam(team: string) {
    this.teams = this.teams.filter((t) => t !== team);
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

  private validate() {
    const projectSchema = z.object({
      name: z.string().min(3).max(20),
      email: z.string().email(),
      projects: z.array(z.string()).optional(),
      teams: z.array(z.string()).optional(),
      tasks: z.array(z.string()).optional(),
      avatar: z.string().min(3).max(20),
    });
    try {
      projectSchema.parse(this);
    } catch (err) {
      const error = err as ZodError;
      const errors = error.flatten().fieldErrors;
      throw new Error(JSON.stringify(errors));
    }
  }
}
