import { StyledString } from "next/dist/build/swc";
import { ZodError, z } from "zod";
export type ListsNextAvailable = Record<string, Record<string, number>>;
export class ProjectEntity {
  private id?: string;
  private name: string;
  private description: string;
  private users: string[];
  // private members: string[];
  private tasks: string[];
  private team: string;
  private createdBy: string;
  private archived: boolean;
  private listsNextAvailable: ListsNextAvailable;
  constructor({
    id,
    name,
    description,
    users,
    // members,
    tasks,
    team,
    createdBy,
    archived = false,
    listsNextAvailable,
  }: {
    id?: string;
    name: string;
    description: string;
    users: string[];
    // admins: string[];
    tasks: string[];
    team: string;
    createdBy: string;
    archived: boolean;
    listsNextAvailable: ListsNextAvailable;
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.users = users;
    // this.admins = admins;
    this.tasks = tasks;
    this.team = team;
    this.createdBy = createdBy;
    this.archived = archived;
    this.listsNextAvailable = listsNextAvailable;
    this.validate();
  }

  getName() {
    return this.name;
  }
  getDescription() {
    return this.description;
  }
  getTasks() {
    return this.tasks;
  }
  getTeam() {
    return this.team;
  }
  getId() {
    return this.id;
  }
  getArchived() {
    return this.archived;
  }
  getUsers() {
    return this.users;
  }
  getCreatedBy() {
    return this.createdBy;
  }
  getListsNextAvailable() {
    return this.listsNextAvailable;
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

  updateArchived(archived: boolean) {
    this.archived = archived;
  }
  addTask(project: string) {
    this.tasks.push(project);
  }
  updateName(name: string) {
    this.name = name;
  }
  updateDescription(description: string) {
    this.description = description;
  }
  updateListsNextAvailable(listsNextAvailable: ListsNextAvailable) {
    this.listsNextAvailable = listsNextAvailable;
  }
  updateTeam(team: string) {
    this.team = team;
  }

  private validate() {
    const projectSchema = z.object({
      name: z.string().min(3).max(20),
      description: z.string().min(5).max(50),
      users: z.array(z.string()).optional(),
      // admins: z.array(z.string()).optional(),
      tasks: z.array(z.string()).optional(),
      createdBy: z.string(),
      archived: z.boolean(),
      listsNextAvailable: z.object({
        priority: z.object({
          High: z.number(),
          Medium: z.number(),
          Low: z.number(),
        }),
        status: z.object({
          "Not Started": z.number(),
          "Up Next": z.number(),
          "In Progress": z.number(),
          Completed: z.number(),
        }),
        category: z.object({
          Household: z.number(),
          Personal: z.number(),
          Work: z.number(),
          School: z.number(),
          Other: z.number(),
        }),
      }),
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
