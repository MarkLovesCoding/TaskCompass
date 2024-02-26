import { ZodError, z } from "zod";

export class ProjectEntity {
  private id?: string;
  private name: string;
  private description: string;
  private admins: string[];
  private members: string[];
  private tasks: string[];
  private team: string;
  private archived: boolean;
  constructor({
    id,
    name,
    description,
    admins,
    members,
    tasks,
    team,
    archived = false,
  }: {
    id?: string;
    name: string;
    description: string;
    members: string[];
    admins: string[];
    tasks: string[];
    team: string;
    archived: boolean;
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.members = members;
    this.admins = admins;
    this.tasks = tasks;
    this.team = team;
    this.archived = archived;
    this.validate();
  }

  getName() {
    return this.name;
  }
  getDescription() {
    return this.description;
  }
  getMembers() {
    return this.members;
  }
  getAdmins() {
    return this.admins;
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

  addMember(member: string) {
    this.members.push(member);
  }
  removeMember(member: string) {
    this.members = this.members.filter((m) => m !== member);
  }
  addMembers(members: string[]) {
    members.forEach((member) => {
      this.members.push(member);
    });
  }
  removeMembers(members: string[]) {
    members.forEach((member) => {
      this.members = this.members.filter((a) => a !== member);
    });
  }
  updateMembers(members: string[]) {
    this.members = members;
  }
  updateAdmins(admins: string[]) {
    this.admins = admins;
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
  updateUserRole(userId: string, role: "admin" | "member") {
    if (role === "admin") {
      this.members = this.members.filter((m) => m !== userId);
      this.admins.push(userId);
    } else if (role === "member") {
      this.admins = this.admins.filter((a) => a !== userId);
      this.members.push(userId);
    }
  }

  private validate() {
    const projectSchema = z.object({
      name: z.string().min(3).max(20),
      description: z.string().min(5).max(50),
      members: z.array(z.string()).optional(),
      admins: z.array(z.string()).optional(),
      tasks: z.array(z.string()).optional(),
      archived: z.boolean(),
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
