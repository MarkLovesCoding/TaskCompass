import { ZodError, z } from "zod";

export class ProjectEntity {
  private id?: string;
  private name: string;
  private description: string;
  private members: string[];
  private tasks: string[];
  private team: string;

  constructor({
    id,
    name,
    description,
    members,
    tasks,
    team,
  }: {
    id?: string;
    name: string;
    description: string;
    members: string[];
    tasks: string[];
    team: string;
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.members = members;
    this.tasks = tasks;
    this.team = team;
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
  getTasks() {
    return this.tasks;
  }
  getTeam() {
    return this.team;
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

  addTask(project: string) {
    this.tasks.push(project);
  }
  updateName(name: string) {
    this.name = name;
  }
  updateDescription(description: string) {
    this.description = description;
  }

  private validate() {
    const projectSchema = z.object({
      name: z.string().min(3).max(20),
      description: z.string().min(5).max(50),
      members: z.array(z.string()).optional(),
      tasks: z.array(z.string()).optional(),
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
