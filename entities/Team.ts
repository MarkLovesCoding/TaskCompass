import { ZodError, z } from "zod";

export class TeamEntity {
  private id?: string;
  private name: string;
  private users: string[];
  private projects: string[];
  private createdBy: string;

  constructor({
    id,
    name,
    users,
    projects,
    createdBy,
  }: {
    id?: string;
    name: string;
    users: string[];
    projects: string[];
    createdBy: string;
  }) {
    this.id = id;
    this.name = name;
    this.users = users;
    this.projects = projects;
    this.createdBy = createdBy;
    this.validate();
  }

  getName() {
    return this.name;
  }
  getUsers() {
    return this.users;
  }

  getProjects() {
    return this.projects;
  }

  getId() {
    return this.id;
  }
  getCreatedBy() {
    return this.createdBy;
  }
  addUser(user: string) {
    this.users.push(user);
  }
  removeUser(user: string) {
    if (user !== this.createdBy) {
      this.users = this.users.filter((m) => m !== user);
    }
  }
  addUsers(users: string[]) {
    users.forEach((user) => {
      this.users.push(user);
    });
  }
  removeUsers(users: string[]) {
    users.forEach((user) => {
      if (user !== this.createdBy) {
        this.users = this.users.filter((a) => a !== user);
      }
    });
  }
  updateUsers(users: string[]) {
    this.users = users;
  }

  addProject(project: string) {
    this.projects.push(project);
  }
  updateName(name: string) {
    this.name = name;
  }

  private validate() {
    const teamSchema = z.object({
      name: z.string().min(3).max(30),
      users: z.array(z.string()).min(0),
      projects: z.array(z.string()).optional(),
      createdBy: z.string(),
    });
    try {
      teamSchema.parse(this);
    } catch (err) {
      const error = err as ZodError;
      const errors = error.flatten().fieldErrors;
      throw new Error(JSON.stringify(errors));
    }
  }
}
