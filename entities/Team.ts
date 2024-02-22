import { ZodError, z } from "zod";

export class TeamEntity {
  private id?: string;
  private name: string;
  private members: string[];
  private admins: string[];
  private projects: string[];

  constructor({
    id,
    name,
    members,
    admins,
    projects,
  }: {
    id?: string;
    name: string;
    members: string[];
    admins: string[];
    projects: string[];
  }) {
    this.id = id;
    this.name = name;
    this.members = members;
    this.admins = admins;
    this.projects = projects;

    this.validate();
  }

  getName() {
    return this.name;
  }
  getMembers() {
    return this.members;
  }
  getAdmins() {
    return this.admins;
  }

  getProjects() {
    return this.projects;
  }

  getId() {
    return this.id;
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

  addProject(project: string) {
    this.projects.push(project);
  }
  updateName(name: string) {
    this.name = name;
  }

  private validate() {
    const teamSchema = z.object({
      name: z.string().min(3).max(20),
      members: z.array(z.string()).min(0),
      admins: z.array(z.string()).min(1),
      projects: z.array(z.string()).optional(),
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
