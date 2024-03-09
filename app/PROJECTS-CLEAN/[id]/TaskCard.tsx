"use client";
import React, { Fragment, useState, useEffect } from "react";
import { unstable_noStore } from "next/cache";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import toast from "react-hot-toast";

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

import { updateTaskArchivedAction } from "../_actions/update-task-archived.action";
import { updateTaskAction } from "../_actions/update-task.action";
import { UserDto } from "@/use-cases/user/types";
import { getInitials } from "@/app/utils/getInitials";
import { updateProjectTasksOrderFromTaskCardAction } from "../_actions/update-project-tasks-order-from-task-card.action";
const taskFormSchema = z.object({
  id: z.string(),
  name: z.string().min(4).max(25),
  description: z.string().min(5).max(50),
  priority: z.string().min(3),
  status: z.string().min(3),
  category: z.string().min(3),
  startDate: z.date(),
  dueDate: z.date(),
  assignees: z.array(z.string()).min(0),
  projectId: z.string().length(24),
});
const archivedFormSchema = z.object({
  id: z.string(),
  archived: z.boolean(),
  projectId: z.string().length(24),
});
let renderCount = 0;
export const TaskCard = ({
  task,
  project,
  projectUsers,
  isTaskOpen,
}: {
  task: TaskDto;
  project: ProjectDto;
  projectUsers: UserDto[];
  isTaskOpen: boolean;
}) => {
  unstable_noStore();
  const formRef = React.useRef<HTMLFormElement>(null);
  const archivedFormRef = React.useRef<HTMLFormElement>(null);
  const [isTaskSelected, setIsTaskSelected] = useState(false);

  useEffect(() => {
    if (isTaskOpen === true) {
      setIsTaskSelected(true);
      console.log("isTaskSelected", isTaskSelected);
    }
    if (isTaskOpen === false && isTaskSelected === true) {
      setIsTaskSelected(false);
      console.log("isTaskSelected", isTaskSelected);
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }
  }, [isTaskOpen, isTaskSelected]);
  const [isNameEditing, setIsNameEditing] = useState(false);

  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      id: task.id,
      name: task.name,
      description: task.description,
      priority: task.priority,
      status: task.status,
      category: task.category,
      startDate: task.startDate,
      dueDate: task.dueDate,
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
  function findChangedType(
    existingPriority: string,
    existingStatus: string,
    existingCategory: string,
    newPriority: string,
    newStatus: string,
    newCategory: string
  ): Record<string, string> | null {
    const changes = [];

    if (existingPriority !== newPriority) {
      changes.push({
        type: "priority",
        newSubType: newPriority,
        existingSubType: existingPriority,
      });
    }

    if (existingStatus !== newStatus) {
      changes.push({
        type: "status",
        newSubType: newStatus,
        existingSubType: existingStatus,
      });
    }

    if (existingCategory !== newCategory) {
      changes.push({
        type: "category",
        newSubType: newCategory,
        existingSubType: existingCategory,
      });
    }

    // if (changes.length === 1) {
    return changes[0];
  }

  const onSubmit = async (values: z.infer<typeof taskFormSchema>) => {
    // Handle form submission
    const taskOrderChanges = findChangedType(
      task.priority,
      task.status,
      task.category,
      values.priority,
      values.status,
      values.category
    );
    if (taskOrderChanges !== null) {
      try {
        await updateProjectTasksOrderFromTaskCardAction(
          values.projectId,
          values.id,

          taskOrderChanges
        );
      } catch (error) {
        toast.error("Error updating task order");
      }
      // toast.success("Task updated");
    }
    try {
      await updateTaskAction(values, task.assignees);
    } catch (error) {
      toast.error("Error updating task");
    }
    toast.success("Task updated");

    router.refresh();
  };
  const { field: archivedField, fieldState: archivedFieldState } =
    useController({
      name: "archived", // Name of the field you want to control
      control: archivedForm.control, // Pass the form control from useForm
      defaultValue: task.archived, // Default value for the field
    });
  const selectedStartDate = useWatch({
    control: form.control,
    name: "startDate",
  });
  const selectedDueDate = useWatch({
    control: form.control,
    name: "dueDate",
  });
  const currentAssignees = useWatch({
    control: form.control,
    name: "assignees",
  });

  const [archivedOpen, setArchivedOpen] = useState(false);

  const handleArchivedCancel = () => {
    archivedForm.setValue("archived", task.archived);
    setArchivedOpen(false);
  };
  const handleArchivedSubmit = () => {
    archivedForm.setValue("archived", true);
    setIsTaskSelected(false);
    archivedFormRef.current!.requestSubmit();
    setArchivedOpen(false);
    // Trigger the onChange event for the field
  };

  const onArchivedFormSubmit = async (
    values: z.infer<typeof archivedFormSchema>
  ) => {
    await updateTaskArchivedAction(values);
    router.refresh();
  };
  const handleNameBlur = () => {
    // nameField.onBlur();
    setIsNameEditing(false);
  };

  const handleNameClick = () => {
    setIsNameEditing(true); // Trigger the onClick event for the field
  };
  const handleDescriptionBlur = () => {
    // descriptionField.onBlur(); // Trigger the onBlur event for the field
    setIsDescriptionEditing(false);
  };
  const handleDescriptionClick = () => {
    setIsDescriptionEditing(true);
  };

  const categories = ["Household", "Personal", "Work", "School", "Other"];
  const priorityOptions = [
    { option: "High", color: "red" },
    { option: "Medium", color: "yellow" },
    { option: "Low", color: "green" },
  ];
  const statusOptions = ["Not Started", "Up Next", "In Progress", "Completed"];
  renderCount++;
  return (
    <>
      <div className="w-[300px]">
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(onSubmit)}
            method="post"
            className="grid gap-6 w-full max-w-md mr-auto  "
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormControl>
                    <Input
                      className={`header-input ${
                        isNameEditing ? "editing" : ""
                      }`}
                      placeholder="Task Name"
                      type="text"
                      {...field}
                      onClick={handleNameClick}
                      onChange={field.onChange}
                      onBlur={handleNameBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormControl>
                    <Textarea
                      className={`description-input w-[300px] resize-none ${
                        isDescriptionEditing ? "editing" : ""
                      }`}
                      placeholder="Description"
                      {...field}
                      onClick={handleDescriptionClick}
                      onChange={field.onChange}
                      onBlur={handleDescriptionBlur}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <RadioGroup
                      name="priority"
                      id="priority"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      // className="flex flex-col space-y-1"
                    >
                      {priorityOptions.map((priority, _index) => (
                        <Fragment key={_index}>
                          <FormItem
                            className={"flex items-center space-x-3 space-y-0"}
                          >
                            <FormControl>
                              <RadioGroupItem
                                id={`priority-${priority.option}`}
                                value={priority.option}
                              />
                            </FormControl>{" "}
                            <FormLabel className={"font-normal"}>
                              {priority.option}
                            </FormLabel>
                          </FormItem>
                        </Fragment>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
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
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex align-middle">
                    Start Date
                  </FormLabel>
                  <Popover
                  //  onOpenChange={handleStartDateChange}
                  >
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
                        // initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex align-middle">Due Date</FormLabel>
                  <Popover
                  // onOpenChange={handleDueDateChange}
                  >
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
                        // initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assignees"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3">
                  <FormLabel>Users Assigned</FormLabel>
                  <div className="flex flex-row w-full">
                    {projectUsers
                      .filter((user) => currentAssignees.includes(user.id))
                      .map((user, index) => (
                        <Avatar key={index} className=" w-12 h-12 m-2">
                          {/* <AvatarImage src={user.avatar} /> */}
                          <AvatarFallback className={`text-sm bg-gray-500`}>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    <FormControl>
                      <DropdownMenu
                      //  onOpenChange={handleAssigneesChange}
                      >
                        <DropdownMenuTrigger asChild>
                          <Avatar className="cursor-pointer  w-12 h-12 m-2">
                            <AvatarFallback
                              className={`text-sm bg-gray-500 hover:bg-grey:700`}
                            >
                              +
                            </AvatarFallback>
                          </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          onFocusOutside={(e) => e.preventDefault()}
                          className="w-56"
                        >
                          <DropdownMenuLabel>Project Users</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {projectUsers?.map((user, index) => (
                            <DropdownMenuCheckboxItem
                              key={index}
                              onSelect={(e) => {
                                e.preventDefault();
                              }}
                              checked={field.value.includes(user.id)} // Check if user is already in assignees
                              onCheckedChange={(checked) => {
                                const updatedAssignees = checked
                                  ? [...field.value, user.id] // Add user to assignees array
                                  : field.value.filter(
                                      (assignee) => assignee !== user.id
                                    ); // Remove user from assignees array
                                field.onChange(updatedAssignees); // Update assignees field value
                              }}
                            >
                              {user.name}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />{" "}
          </form>
        </Form>{" "}
        <Form {...form}>
          <form
            ref={archivedFormRef}
            onSubmit={archivedForm.handleSubmit(onArchivedFormSubmit)}
            method="post"
            className="grid gap-6 w-full max-w-md mr-auto  "
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
      </div>
    </>
  );
};
