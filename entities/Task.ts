import { ZodError, z } from "zod";
export type OrderInLists = Record<string, [string, number]>;

export class TaskEntity {
  private id?: string;
  private name: string;
  private description: string;
  private project: string;
  private assignees: string[];
  private dueDate: Date;
  private startDate: Date;
  private archived: boolean;
  private priority: string;
  private category: string;
  private status: string;
  // private orderInLists: OrderInLists;
  // private label?: string;

  constructor({
    id,
    name = "New Task",
    description = "Task Description",
    project,
    assignees = [],
    dueDate = new Date(new Date().setDate(new Date().getDate() + 7)),
    startDate = new Date(),
    archived = false,
    category = "Personal",
    priority = "Medium",
    status = "To Do",
  }: // orderInLists,
  // label,
  {
    id?: string;
    name: string;
    description: string;
    project: string;
    assignees: string[];
    dueDate: Date;
    startDate: Date;
    category: string;
    archived: boolean;
    priority: string;
    status: string;
    // orderInLists: OrderInLists;
    // label?: string | undefined;
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.project = project;
    this.assignees = assignees;
    this.category = category;
    this.dueDate = dueDate;
    this.startDate = startDate;
    this.archived = archived;

    this.priority = priority;
    this.status = status;
    // this.orderInLists = orderInLists;
    // this.label = label;

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
  getArchived() {
    return this.archived;
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
  // getLabel() {
  //   return this.label;
  // }
  // getOrderInLists() {
  //   return this.orderInLists;
  // }
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
  updateDueDate(dueDate: Date) {
    this.dueDate = dueDate;
  }
  updateStartDate(startDate: Date) {
    this.startDate = startDate;
  }
  updateArchived(archived: boolean) {
    this.archived = archived;
  }
  updatePriority(priority: string) {
    this.priority = priority;
  }
  updateStatus(status: string) {
    this.status = status;
  }
  // updateLabel(label: string) {
  //   this.label = label;
  // }
  updateCategory(category: string) {
    this.category = category;
  }
  // updateOrderInLists(orderInLists: OrderInLists) {
  //   this.orderInLists = orderInLists;
  // }
  removeAssignee(assignee: string) {
    this.assignees = this.assignees.filter((a) => a !== assignee);
  }
  private validate() {
    const taskSchema = z.object({
      name: z.string().min(3).max(25),
      description: z.string().min(3).max(50),
      project: z.string(),
      assignees: z.array(z.string()).min(0),
      dueDate: z.date().optional(),
      startDate: z.date(),
      archived: z.boolean(),
      priority: z.string(),
      status: z.string(),
      // orderInLists: z.object({
      //   priority: z.array(z.union([z.string(), z.number()])).min(2),
      //   status: z.array(z.union([z.string(), z.number()])).min(2),
      //   category: z.array(z.union([z.string(), z.number()])).min(2),
      // }),
      // label: z.string(),
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
