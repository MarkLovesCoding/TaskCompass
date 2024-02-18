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
    name = "New Task",
    description = "Task Description",
    project,
    assignees = [],
    dueDate = new Date(new Date().setDate(new Date().getDate() + 7)),
    startDate = new Date(),
    complete = false,
    category = "Personal",
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
  updateName(name: string) {
    this.name = name;
  }
  updateDescription(description: string) {
    this.description = description;
  }
  updateProject(project: string) {
    this.project = project;
  }
  addAssignees(assignees: string[]) {
    assignees.forEach((assignee) => {
      if (this.assignees.indexOf(assignee) === -1) {
        this.assignees.push(assignee);
      }
    });
  }
  removeAssignees(assignees: string[]) {
    assignees.forEach((assignee) => {
      this.assignees = this.assignees.filter((a) => a !== assignee);
    });
  }
  updateDueDate(dueDate: Date | undefined) {
    this.dueDate = dueDate;
  }
  updateStartDate(startDate: Date) {
    this.startDate = startDate;
  }
  updateComplete(complete: boolean) {
    this.complete = complete;
  }
  updatePriority(priority: string) {
    this.priority = priority;
  }
  updateStatus(status: string) {
    this.status = status;
  }
  updateLabel(label: string) {
    this.label = label;
  }
  updateCategory(category: string) {
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
      assignees: z.array(z.string()).min(0),
      dueDate: z.date().optional(),
      startDate: z.date(),
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
