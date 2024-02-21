"use client";
import React, { Fragment, use, useEffect, useState } from "react";
import { unstable_noStore } from "next/cache";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import * as z from "zod";
import { useController, useWatch } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectDto } from "@/use-cases/project/types";
import { TaskDto } from "@/use-cases/task/types";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { findAssigneesDifferences } from "@/lib/utils";
import { updateTaskUsersAction } from "../_actions/update-task-users.action";
import { updateTaskNameAction } from "../_actions/update-task-name.action";
import { updateTaskDescriptionAction } from "../_actions/update-task-description.action";
import { updateTaskPriorityAction } from "../_actions/update-task-priority.action";
import { updateTaskStatusAction } from "../_actions/update-task-status.action";
import { updateTaskCategoryAction } from "../_actions/update-task-category.action";
import { updateTaskStartDateAction } from "../_actions/update-task-start-date.action";
import { updateTaskDueDateAction } from "../_actions/update-task-due-date.action";
import { updateTaskArchivedAction } from "../_actions/update-task-archived.action";
type TaskFormProps = {
  task: TaskDto;
  project: ProjectDto;
};

const descriptionFormSchema = z.object({
  id: z.string(),
  description: z.string().min(5),
  projectId: z.string().length(24),
});
const nameFormSchema = z.object({
  id: z.string(),
  name: z.string().min(4),
  projectId: z.string().length(24),
});
const priorityFormSchema = z.object({
  id: z.string(),
  priority: z.string().min(3),
  projectId: z.string().length(24),
});
const statusFormSchema = z.object({
  id: z.string(),
  status: z.string().min(3),
  projectId: z.string().length(24),
});
const categoryFormSchema = z.object({
  id: z.string(),
  category: z.string().min(3),
  projectId: z.string().length(24),
});
const startDateFormSchema = z.object({
  id: z.string(),
  startDate: z.date(),
  projectId: z.string().length(24),
});
const dueDateFormSchema = z.object({
  id: z.string(),
  dueDate: z.date(),
  projectId: z.string().length(24),
});
const assigneesFormSchema = z.object({
  id: z.string(),
  assignees: z.array(z.string()).min(0),
  projectId: z.string().length(24),
});
const archivedFormSchema = z.object({
  id: z.string(),
  archived: z.boolean(),
  projectId: z.string().length(24),
});
let renderCount = 0;
export const TaskCard: React.FC<TaskFormProps> = ({ task, project }) => {
  unstable_noStore();
  const projectUsers = project.members;
  const [descriptionButtonShow, setDescriptionButtonShow] = useState(false);

  const [isNameEditing, setIsNameEditing] = useState(false);
  // const [nameContent, setNameContent] = useState(task.name);
  // const [descriptionContent, setDescriptionContent] = useState(
  //   task.description
  // );
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const router = useRouter();

  const nameForm = useForm<z.infer<typeof nameFormSchema>>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: {
      id: task.id,
      name: task.name,
      projectId: project.id,
    },
  });
  const descriptionForm = useForm<z.infer<typeof descriptionFormSchema>>({
    resolver: zodResolver(descriptionFormSchema),
    defaultValues: {
      id: task.id,
      description: task.description,
      projectId: project.id,
    },
  });

  const priorityForm = useForm<z.infer<typeof priorityFormSchema>>({
    resolver: zodResolver(priorityFormSchema),
    defaultValues: {
      id: task.id,
      priority: task.priority,
      projectId: project.id,
    },
  });

  const statusForm = useForm<z.infer<typeof statusFormSchema>>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      id: task.id,
      status: task.status,
      projectId: project.id,
    },
  });
  const categoryForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      id: task.id,
      category: task.category,
      projectId: project.id,
    },
  });
  const startDateForm = useForm<z.infer<typeof startDateFormSchema>>({
    resolver: zodResolver(startDateFormSchema),
    defaultValues: {
      id: task.id,
      startDate: task.startDate,
      projectId: project.id,
    },
  });
  const dueDateForm = useForm<z.infer<typeof dueDateFormSchema>>({
    resolver: zodResolver(dueDateFormSchema),
    defaultValues: {
      id: task.id,
      dueDate: task.dueDate,
      projectId: project.id,
    },
  });
  const assigneesForm = useForm<z.infer<typeof assigneesFormSchema>>({
    resolver: zodResolver(assigneesFormSchema),
    defaultValues: {
      id: task.id,
      assignees: task.assignees,
      projectId: project.id,
    },
  });
  const archivedForm = useForm<z.infer<typeof archivedFormSchema>>({
    resolver: zodResolver(archivedFormSchema),
    defaultValues: {
      id: task.id,
      archived: task.archived,
      projectId: project.id,
    },
  });
  const { field: nameField, fieldState: nameFieldState } = useController({
    name: "name", // Name of the field you want to control
    control: nameForm.control, // Pass the form control from useForm
    defaultValue: task.name, // Default value for the field
    rules: {
      // Optional rules for validation
      minLength: 4,
      maxLength: 20,
    },
  });
  const { field: descriptionField, fieldState: descriptionFieldState } =
    useController({
      name: "description", // Name of the field you want to control
      control: descriptionForm.control, // Pass the form control from useForm
      defaultValue: task.description, // Default value for the field
      rules: {
        // Optional rules for validation
        minLength: 4,
        maxLength: 50,
      },
    });
  const { field: priorityField, fieldState: priorityFieldState } =
    useController({
      name: "priority", // Name of the field you want to control
      control: priorityForm.control, // Pass the form control from useForm
      defaultValue: task.priority, // Default value for the field
      rules: {
        // Optional rules for validation
        minLength: 3,
        maxLength: 20,
      },
    });
  const { field: statusField, fieldState: statusFieldState } = useController({
    name: "status", // Name of the field you want to control
    control: statusForm.control, // Pass the form control from useForm
    defaultValue: task.status, // Default value for the field
    rules: {
      // Optional rules for validation
      minLength: 3,
      maxLength: 20,
    },
  });
  const { field: categoryField, fieldState: categoryFieldState } =
    useController({
      name: "category", // Name of the field you want to control
      control: categoryForm.control, // Pass the form control from useForm
      defaultValue: task.category, // Default value for the field
      rules: {
        // Optional rules for validation
        minLength: 3,
        maxLength: 20,
      },
    });
  const { field: assigneesField, fieldState: assigneesFieldState } =
    useController({
      name: "assignees", // Name of the field you want to control
      control: assigneesForm.control, // Pass the form control from useForm
      defaultValue: task.assignees, // Default value for the field
    });
  const { field: archivedField, fieldState: archivedFieldState } =
    useController({
      name: "archived", // Name of the field you want to control
      control: archivedForm.control, // Pass the form control from useForm
      defaultValue: task.archived, // Default value for the field
    });

  const selectedStartDate = useWatch({
    control: startDateForm.control,
    name: "startDate",
  });
  const selectedDueDate = useWatch({
    control: dueDateForm.control,
    name: "dueDate",
  });
  const currentAssignees = useWatch({
    control: assigneesForm.control,
    name: "assignees",
  });
  const currentDescription = useWatch({
    control: descriptionForm.control,
    name: "description",
  });

  const [existingAssignees, setExistingAssignees] = useState<string[]>([
    ...task.assignees,
  ]);

  const nameFormRef = React.useRef<HTMLFormElement>(null);
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    nameField.onChange(event); // Trigger the onChange event for the field
    console.log("____>>>handleNAME changed");
  };
  const handleNameBlur = () => {
    nameField.onBlur();
    setIsNameEditing(false);
    nameFormRef.current!.requestSubmit();
  };

  const handleNameClick = () => {
    setIsNameEditing(true); // Trigger the onClick event for the field
  };

  const onNameSubmit = async (values: z.infer<typeof nameFormSchema>) => {
    if (task.name !== values.name) {
      await updateTaskNameAction(values);
      console.log("name values changed", values);
      router.refresh();
    }
  };
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    descriptionField.onChange(event); // Trigger the onChange event for the field
    setDescriptionButtonShow(true);
  };
  const handleDescriptionBlur = () => {
    descriptionField.onBlur(); // Trigger the onBlur event for the field
    setIsDescriptionEditing(false);
    if (task.description == currentDescription) {
      setDescriptionButtonShow(false);
    }
  };
  const handleDescriptionClick = () => {
    setIsDescriptionEditing(true);
  };
  const onDescriptionSubmit = async (
    values: z.infer<typeof descriptionFormSchema>
  ) => {
    if (task.description !== values.description) {
      console.log("description values", values);
      await updateTaskDescriptionAction(values);
      setDescriptionButtonShow(false);
      router.refresh();
    }
  };

  const priorityFormRef = React.useRef<HTMLFormElement>(null);
  const handlePriorityChange = (value: string) => {
    console.log("priority", value);
    priorityField.onChange(value);
    priorityFormRef.current!.requestSubmit();
    // Trigger the onChange event for the field
  };
  const onPrioritySubmit = async (
    values: z.infer<typeof priorityFormSchema>
  ) => {
    await updateTaskPriorityAction(values);
    console.log("priority valueschanged ", values);
    router.refresh();
  };

  const statusFormRef = React.useRef<HTMLFormElement>(null);

  const handleStatusChange = (value: string) => {
    console.log("status", value);
    statusField.onChange(value);
    statusFormRef.current!.requestSubmit();
    // Trigger the onChange event for the field
  };
  const onStatusSubmit = async (values: z.infer<typeof statusFormSchema>) => {
    await updateTaskStatusAction(values);
    console.log("status values", values);
    router.refresh();
  };

  const categoryFormRef = React.useRef<HTMLFormElement>(null);

  const handleCategoryChange = (value: string) => {
    categoryField.onChange(value);
    categoryFormRef.current!.requestSubmit();
    // Trigger the onChange event for the field
  };
  const onCategorySubmit = async (
    values: z.infer<typeof categoryFormSchema>
  ) => {
    await updateTaskCategoryAction(values);
    router.refresh();
  };

  const startDateFormRef = React.useRef<HTMLFormElement>(null);

  const handleStartDateChange = (open: boolean) => {
    if (open === false) startDateFormRef.current!.requestSubmit();
    // Trigger the onChange event for the field
  };
  const onStartDateSubmit = async (
    values: z.infer<typeof startDateFormSchema>
  ) => {
    await updateTaskStartDateAction(values);
    router.refresh();
  };
  const dueDateFormRef = React.useRef<HTMLFormElement>(null);

  const handleDueDateChange = (open: boolean) => {
    if (open === false) dueDateFormRef.current!.requestSubmit();
    // Trigger the onChange event for the field
  };
  const onDueDateSubmit = async (values: z.infer<typeof dueDateFormSchema>) => {
    await updateTaskDueDateAction(values);
    router.refresh();
  };
  const assigneesFormRef = React.useRef<HTMLFormElement>(null);
  const handleAssigneesChange = (open: boolean) => {
    if (open === false) assigneesFormRef.current!.requestSubmit();
    // Trigger the onChange event for the field
  };

  const onAssigneesSubmit = async (
    values: z.infer<typeof assigneesFormSchema>
  ) => {
    const { addedAssignees, removedAssignees } = findAssigneesDifferences(
      existingAssignees,
      currentAssignees
    );
    await updateTaskUsersAction(values.id, addedAssignees, removedAssignees);

    router.refresh();
  };

  const archivedFormRef = React.useRef<HTMLFormElement>(null);
  const [archivedOpen, setArchivedOpen] = useState(false);
  const handleArchivedSubmit = () => {
    archivedForm.setValue("archived", true);
    // console.log("archivedOpen", archivedOpen);
    archivedFormRef.current!.requestSubmit();
    setArchivedOpen(false);
    // Trigger the onChange event for the field
  };
  const handleArchivedCancel = () => {
    // archivedForm.setValue("archived", false);
    // archivedFormRef.current!.requestSubmit();

    archivedForm.setValue("archived", task.archived);
    setArchivedOpen(false);
    // console.log("archivedOpen", archivedOpen);

    // Trigger the onChange event for the field
  };
  const onArchivedSubmit = async (
    values: z.infer<typeof archivedFormSchema>
  ) => {
    await updateTaskArchivedAction(values);
    router.refresh();
  };

  const categories = ["Household", "Personal", "Work", "School", "Other"];
  const priorityOptions = ["High", "Medium", "Low"];
  const statusOptions = ["Not Started", "Up Next", "In Progress", "Completed"];
  renderCount++;
  return (
    <>
      <Form {...nameForm}>
        <form
          ref={nameFormRef}
          onSubmit={nameForm.handleSubmit(onNameSubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <FormField
            control={nameForm.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormControl>
                  <Input
                    className={`header-input ${isNameEditing ? "editing" : ""}`}
                    placeholder="Task Name"
                    type="text"
                    {...field}
                    onClick={handleNameClick}
                    onChange={handleNameChange}
                    onBlur={handleNameBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Form {...descriptionForm}>
        <form
          onSubmit={descriptionForm.handleSubmit(onDescriptionSubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <FormField
            control={descriptionForm.control}
            name="description"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormControl>
                  <Textarea
                    className={`description-input resize-none ${
                      isDescriptionEditing ? "editing" : ""
                    }`}
                    placeholder="Description"
                    {...field}
                    onClick={handleDescriptionClick}
                    onChange={handleDescriptionChange}
                    onBlur={handleDescriptionBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {descriptionButtonShow && <Button type="submit">Save</Button>}
        </form>
      </Form>
      <Form {...priorityForm}>
        <form
          ref={priorityFormRef}
          onSubmit={priorityForm.handleSubmit(onPrioritySubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <FormField
            control={priorityForm.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Priority</FormLabel>
                <FormControl>
                  <RadioGroup
                    name="priority"
                    id="priority"
                    onValueChange={handlePriorityChange}
                    defaultValue={field.value}
                    className="flex flex-row space-x-1"
                  >
                    {priorityOptions.map((priority, _index) => (
                      <Fragment key={_index}>
                        <FormItem className="flex flex-col items-center space-y-2">
                          <FormLabel className="font-normal">
                            {priority}
                          </FormLabel>
                          <FormControl>
                            <RadioGroupItem
                              id={`priority-${priority}`}
                              value={priority}
                            />
                          </FormControl>
                        </FormItem>
                      </Fragment>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
        </form>
      </Form>
      <Form {...statusForm}>
        <form
          ref={statusFormRef}
          onSubmit={statusForm.handleSubmit(onStatusSubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <FormField
            control={statusForm.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={handleStatusChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {statusOptions?.map((status, _index) => (
                      <SelectItem key={_index} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Form {...categoryForm}>
        <form
          ref={categoryFormRef}
          onSubmit={categoryForm.handleSubmit(onCategorySubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <FormField
            control={categoryForm.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={handleCategoryChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category, _index) => (
                      <SelectItem key={_index} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Form {...startDateForm}>
        <form
          ref={startDateFormRef}
          onSubmit={startDateForm.handleSubmit(onStartDateSubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <FormField
            control={startDateForm.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex align-middle">Start Date</FormLabel>
                <Popover onOpenChange={handleStartDateChange}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a Start Date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        (selectedDueDate && date > selectedDueDate) ||
                        date < new Date("1947-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Form {...dueDateForm}>
        <form
          ref={dueDateFormRef}
          onSubmit={dueDateForm.handleSubmit(onDueDateSubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <FormField
            control={dueDateForm.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex align-middle">Due Date</FormLabel>
                <Popover onOpenChange={handleDueDateChange}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a Due Date</span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < selectedStartDate ||
                        date < new Date("1947-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <Form {...assigneesForm}>
        <form
          ref={assigneesFormRef}
          onSubmit={assigneesForm.handleSubmit(onAssigneesSubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <FormField
            control={assigneesForm.control}
            name="assignees"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-3">
                <FormLabel>Users Assigned</FormLabel>
                <div className="flex flex-row w-full justify-around">
                  {currentAssignees.map((user, _index) => (
                    <div key={_index}>{user}</div>
                  ))}
                  <FormControl>
                    <DropdownMenu onOpenChange={handleAssigneesChange}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline"> + </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Project Users</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {projectUsers?.map((user, index) => (
                          <DropdownMenuCheckboxItem
                            key={index}
                            checked={field.value.includes(user)} // Check if user is already in assignees
                            onCheckedChange={(checked) => {
                              const updatedAssignees = checked
                                ? [...field.value, user] // Add user to assignees array
                                : field.value.filter(
                                    (assignee) => assignee !== user
                                  ); // Remove user from assignees array
                              field.onChange(updatedAssignees); // Update assignees field value
                            }}
                          >
                            {user}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <Form {...archivedForm}>
        <form
          ref={archivedFormRef}
          onSubmit={archivedForm.handleSubmit(onArchivedSubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <FormField
            control={archivedForm.control}
            name="archived"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex align-middle">
                  Archive Task
                </FormLabel>
                <Popover open={archivedOpen} onOpenChange={setArchivedOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          "text-muted-foreground"
                        )}
                      >
                        Archive
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Card>
                      <CardHeader>
                        <CardTitle>Archive Task</CardTitle>
                      </CardHeader>
                      <CardDescription>
                        Are you sure you want to archive this task? It can be
                        retrieved from the archive later.
                      </CardDescription>
                      <CardFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            console.log("archived");
                            handleArchivedSubmit();
                          }}
                        >
                          Archive
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            handleArchivedCancel();
                            console.log("cancel");
                          }}
                        >
                          Cancel
                        </Button>
                      </CardFooter>
                    </Card>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
};
