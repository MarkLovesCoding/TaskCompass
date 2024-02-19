"use client";
import React, { Fragment, use, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DevTool } from "@hookform/devtools";
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
import type { SelectSingleEventHandler } from "react-day-picker";
import { cn } from "@/lib/utils";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import * as z from "zod";
import { useController, useWatch } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectDto } from "@/use-cases/project/types";
import { TaskDto } from "@/use-cases/task/types";
import { format } from "date-fns";
import { createNewTaskAction } from "../_actions/create-new-task.action";
import { updateTaskAction } from "../_actions/update-task.action";
import { Checkbox } from "@/components/ui/checkbox";
import { useProjectContext } from "./ProjectContext";
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
type TaskFormProps = {
  task: TaskDto;
  project: ProjectDto;
  // onSubmit: (data: TaskType) => void;
};
type Checked = DropdownMenuCheckboxItemProps["checked"];

const formSchema = z.object({
  id: z.string(),
  // priority: z.string().min(1),
  // category: z.string().min(1),
  // status: z.string().min(1),
  // dueDate: z.date().optional(),
  // startDate: z.date(),
  project: z.string().length(24),
  complete: z.boolean(),
  assignees: z.array(z.string()).min(0),
  label: z.string().min(0).optional(),
});
const descriptionFormSchema = z.object({
  id: z.string(),
  description: z.string().min(4),
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
let renderCount = 0;
export const TaskCard: React.FC<TaskFormProps> = ({ task, project }) => {
  const projectUsers = project.members;
  const [descriptionButtonShow, setDescriptionButtonShow] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: task.id,
      // name: isNewTask ? "New Task Name" : task.name,
      // description: isNewTask ? "Describe your task here" : task.description,
      // priority: task.priority,
      // status: task.status,
      // category: task.category,
      // dueDate: task.dueDate,
      // startDate: task.startDate,
      assignees: task.assignees,
      // complete: task.complete,
      project: project.id,
      label: task.label,
    },
  });
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
  const { field: descriptionfield, fieldState: descriptionFieldState } =
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
  // const { field: startDateField, fieldState: startDateFieldState } =
  //   useController({
  //     name: "startDate", // Name of the field you want to control
  //     control: startDateForm.control, // Pass the form control from useForm
  //     defaultValue: task.startDate, // Default value for the field
  //     // rules: {
  //     //   // Optional rules for validation
  //     //   minLength: 3,
  //     //   maxLength: 20,
  //     // },
  //   });
  // const { field: dueDateField, fieldState: dueDateFieldState } = useController({
  //   name: "dueDate", // Name of the field you want to control
  //   control: dueDateForm.control, // Pass the form control from useForm
  //   defaultValue: task.dueDate, // Default value for the field
  //   // rules: {
  //   //   // Optional rules for validation
  //   //   minLength: 3,
  //   //   maxLength: 20,
  //   // },
  // });
  const selectedStartDate = useWatch({
    control: startDateForm.control,
    name: "startDate",
  });
  const selectedDueDate = useWatch({
    control: dueDateForm.control,
    name: "dueDate",
  });
  const currentAssignees = useWatch({
    control: form.control,
    name: "assignees",
  });
  console.log("selectedStartDate", selectedStartDate);
  console.log("selectedDueDate", selectedDueDate);

  const [existingAssignees, setExistingAssignees] = useState<string[]>([]);
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    nameField.onChange(event); // Trigger the onChange event for the field
    console.log("____>>>handleNAME changed");
  };
  // const handleNameBlur = () => {
  //   nameField.onBlur(); // Trigger the onBlur event for the field
  //   setIsNameEditing(false);
  //   console.log("____>>>handleNAME BLURRRRED");
  //   // setNameButtonShow(false);
  //   //TO DO
  //   //trigger submit if changed
  // };

  const handleNameClick = () => {
    setIsNameEditing(true); // Trigger the onClick event for the field
  };
  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    descriptionfield.onChange(event); // Trigger the onChange event for the field
    setDescriptionButtonShow(true);
  };
  const handleDescriptionBlur = () => {
    descriptionfield.onBlur(); // Trigger the onBlur event for the field
    setIsDescriptionEditing(false);
    // setDescriptionButtonShow(false);
  };
  const handleDescriptionClick = () => {
    setIsDescriptionEditing(true);
  };
  const onDescriptionSubmit = async (
    values: z.infer<typeof descriptionFormSchema>
  ) => {
    console.log("description values", values);
    await updateTaskDescriptionAction(values);
    setDescriptionButtonShow(false);

    router.refresh();
  };
  const onNameSubmit = async (values: z.infer<typeof nameFormSchema>) => {
    await updateTaskNameAction(values);
    console.log("name values", values);
    // setNameButtonShow(false);
    router.refresh();
  };
  const priorityFormRef = React.useRef<HTMLFormElement>(null);
  const handlePriorityChange = (value: string) => {
    console.log("priority", value);
    priorityField.onChange(value);
    priorityFormRef.current!.requestSubmit();
    // Trigger the onChange event for the field
    // await updateTaskPriorityAction(values);
    // (event: React.ChangeEvent<HTMLElement>)
  };
  const onPrioritySubmit = async (
    values: z.infer<typeof priorityFormSchema>
  ) => {
    await updateTaskPriorityAction(values);
    console.log("priority values", values);
    // setNameButtonShow(false);
    router.refresh();
  };

  const statusFormRef = React.useRef<HTMLFormElement>(null);

  const handleStatusChange = (value: string) => {
    console.log("status", value);
    statusField.onChange(value);
    statusFormRef.current!.requestSubmit();
    // Trigger the onChange event for the field
    // await updateTaskPriorityAction(values);
    // (event: React.ChangeEvent<HTMLElement>)
  };
  const onStatusSubmit = async (values: z.infer<typeof statusFormSchema>) => {
    await updateTaskStatusAction(values);
    console.log("status values", values);
    // setNameButtonShow(false);
    router.refresh();
  };

  const categoryFormRef = React.useRef<HTMLFormElement>(null);

  const handleCategoryChange = (value: string) => {
    console.log("category", value);
    categoryField.onChange(value);
    categoryFormRef.current!.requestSubmit();
    // Trigger the onChange event for the field
    // await updateTaskPriorityAction(values);
    // (event: React.ChangeEvent<HTMLElement>)
  };
  const onCategorySubmit = async (
    values: z.infer<typeof categoryFormSchema>
  ) => {
    await updateTaskCategoryAction(values);
    console.log("category values", values);
    // setNameButtonShow(false);
    router.refresh();
  };

  const startDateFormRef = React.useRef<HTMLFormElement>(null);

  const handleStartDateChange = (open: boolean) => {
    // startDateField.onChange();
    startDateFormRef.current!.requestSubmit();
    // Trigger the onChange event for the field
    // await updateTaskPriorityAction(values);
    // (event: React.ChangeEvent<HTMLElement>)
  };
  const onStartDateSubmit = async (
    values: z.infer<typeof startDateFormSchema>
  ) => {
    await updateTaskStartDateAction(values);
    console.log("category startDate", values);
    // setNameButtonShow(false);
    router.refresh();
  };
  const dueDateFormRef = React.useRef<HTMLFormElement>(null);

  const handleDueDateChange = (open: boolean) => {
    // dueDateField.onChange(day);
    dueDateFormRef.current!.requestSubmit();
    // Trigger the onChange event for the field
    // await updateTaskPriorityAction(values);
    // (event: React.ChangeEvent<HTMLElement>)
  };
  const onDueDateSubmit = async (values: z.infer<typeof dueDateFormSchema>) => {
    await updateTaskDueDateAction(values);
    console.log("category dueDate", values);
    // setNameButtonShow(false);
    router.refresh();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("form submitted: ", values);
    await updateTaskAction(values);
    setIsSubmitting(true);

    // handleUpdateTaskSubmitClose(false);
    const { addedAssignees, removedAssignees } = findAssigneesDifferences(
      existingAssignees,
      currentAssignees
    );

    updateTaskUsersAction(values.id, addedAssignees, removedAssignees);

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
          onSubmit={nameForm.handleSubmit(onNameSubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          {/* <Card className="w-full max-w-md p-4 md:p-8 grid gap-4">
            <CardHeader> */}
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
                    onBlur={(e) => {
                      nameField.onBlur();
                      setIsNameEditing(false);
                      e.target.form!.requestSubmit();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* {nameButtonShow && <Button type="submit">Save</Button>} */}
        </form>
      </Form>
      <Form {...descriptionForm}>
        <form
          onSubmit={descriptionForm.handleSubmit(onDescriptionSubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          {/* <Card className="w-full max-w-md p-4 md:p-8 grid gap-4">
            <CardHeader> */}
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
          {/* <Button
            type="submit"
            className="m-auto flex justify-center align-middle w-fit"
            disabled={isSubmitting}
          >
            {"Save"}
          </Button> */}
        </form>
      </Form>
      <Form {...priorityForm}>
        <form
          ref={priorityFormRef}
          onSubmit={priorityForm.handleSubmit(onPrioritySubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          {/* <Card className="w-full max-w-md p-4 md:p-8 grid gap-4">
            <CardHeader> */}
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
                    // onValueChange={field.onChange}
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
          {/* {nameButtonShow && <Button type="submit">Save</Button>} */}
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
          {/* {nameButtonShow && <Button type="submit">Save</Button>} */}
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
          {/* {nameButtonShow && <Button type="submit">Save</Button>} */}
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
                      // onSelect={handleDueDateChange}
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
          {/* {nameButtonShow && <Button type="submit">Save</Button>} */}
        </form>
      </Form>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
            {/* {EDITMODE === true ? "Update Task" : "Create New Task"} */}
            {renderCount}
          </h2>
          {/* <Card className="w-full max-w-md p-4 md:p-8 grid gap-4">
            <CardHeader> */}
          {/* <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormControl>
                  <Input
                    className={`header-input ${
                      isHeaderEditing ? "editing" : ""
                    }`}
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
          />{" "}
          <FormField
            control={form.control}
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
          /> */}
          {/* </CardHeader> */}
          {/* <CardContent className="grid gap-4"> */}
          {/* <div className="grid gap-2">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <RadioGroup
                      name="priority"
                      id="priority"
                      onValueChange={field.onChange}
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
            />
          </div> */}
          {/* <div className="grid gap-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
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
          </div> */}
          {/* <div className="grid gap-2">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
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
          </div> */}
          {/* <div className="grid gap-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className=" ">
                  <FormLabel className="flex align-middle">
                    Start Date
                  </FormLabel>
                  <Popover>
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
                          date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex align-middle">Due Date</FormLabel>
                  <Popover>
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
                          date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
          {/* <div className=" items-center gap-2">
            <FormField
              control={form.control}
              name="complete"
              render={({ field }) => (
                <FormItem className="h-[50px]">
                  <FormLabel className="  flex  align-middle">
                    Archive
                  </FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
          <div className=" items-center gap-2 w-full  flex ">
            <FormField
              control={form.control}
              name="assignees"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3">
                  <FormLabel>Users Assigned</FormLabel>
                  <div className="flex flex-row w-full justify-around">
                    {currentAssignees.map((user, _index) => (
                      <div key={_index}>{user}</div>
                    ))}
                    <FormControl>
                      <DropdownMenu>
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
          </div>
          {/* </CardContent> */}
          {/* </Card> */}
          <Button
            type="submit"
            className="m-auto flex justify-center align-middle w-fit"
            disabled={isSubmitting}
          >
            {"Save Task"}
          </Button>
          {/* <DialogClose asChild>
            <Button
              type="button"
              className="m-auto flex justify-center align-middle w-fit"
            >
              Close
            </Button>
          </DialogClose> */}
        </form>{" "}
      </Form>
      {/* <DevTool control={control} placement="top-left" /> */}
    </>
  );
};
