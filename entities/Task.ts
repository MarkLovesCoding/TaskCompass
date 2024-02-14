import { ZodError, z } from "zod";

export class TaskEntity {
  private id?: string;
  private name: string;
  private description: string;
  private project: string;
  private assignees: string[];
  private dueDate?: Date | undefined;
  private startDate: Date;
  private complete: boolean;
  private priority: string;
  private category: string;
  private status: string;
  private label?: string;

  constructor({
    id,
    name,
    description = "",
    project,
    assignees = [],
    dueDate,
    startDate = new Date(),
    complete = false,
    category,
    priority = "Medium",
    status = "To Do",
    label,
  }: {
    id?: string;
    name: string;
    description: string;
    project: string;
    assignees: string[];
    dueDate?: Date | undefined;
    startDate: Date;
    category: string;
    complete: boolean;
    priority: string;
    status: string;
    label?: string | undefined;
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.project = project;
    this.assignees = assignees;
    this.category = category;
    this.dueDate = dueDate;
    this.startDate = startDate;
    this.complete = complete;

    this.priority = priority;
    this.status = status;
    this.label = label;

    this.validate();
  }

  getName() {
    return this.name;
  }
  getDescription() {
    return this.description;
  }
  getProject() {
    return this.project;
  }
  getAssignees() {
    return this.assignees;
  }
  getDueDate() {
    return this.dueDate;
  }
  getStartDate() {
    return this.startDate;
  }
  getComplete() {
    return this.complete;
  }
  getCategory() {
    return this.category;
  }
  getPriority() {
    return this.priority;
  }
  getStatus() {
    return this.status;
  }
  getLabel() {
    return this.label;
  }
  getId() {
    return this.id;
  }
  setName(name: string) {
    this.name = name;
  }
  setDescription(description: string) {
    this.description = description;
  }
  setProject(project: string) {
    this.project = project;
  }
  setAssignees(assignee: string) {
    this.assignees.push(assignee);
  }

  setDueDate(dueDate: Date | undefined) {
    this.dueDate = dueDate;
  }
  setStartDate(startDate: Date) {
    this.startDate = startDate;
  }
  setComplete(complete: boolean) {
    this.complete = complete;
  }
  setPriority(priority: string) {
    this.priority = priority;
  }
  setStatus(status: string) {
    this.status = status;
  }
  setLabel(label: string) {
    this.label = label;
  }
  setCategory(category: string) {
    this.category = category;
  }

  removeAssignee(assignee: string) {
    this.assignees = this.assignees.filter((a) => a !== assignee);
  }
  private validate() {
    const taskSchema = z.object({
      name: z.string().min(3).max(20),
      description: z.string().min(5).max(50),
      project: z.string(),
      assignees: z.array(z.string()).min(1),
      dueDate: z.number().optional(),
      startDate: z.number(),
      complete: z.boolean(),
      priority: z.string(),
      status: z.string(),
      label: z.string(),
    });
    try {
      taskSchema.parse(this);
    } catch (err) {
      const error = err as ZodError;
      const errors = error.flatten().fieldErrors;
      throw new Error(JSON.stringify(errors));
    }
  }
}
