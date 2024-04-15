"use client";
import React, { Fragment, useState, useEffect } from "react";
import { unstable_noStore } from "next/cache";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { ArchiveIcon } from "lucide-react";
import { Button } from "@/components/ui/button-alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog-user-search";
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
import { cn } from "@/lib/utils/utils";
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
import { getInitials } from "@/lib/utils/getInitials";
import { updateProjectTasksOrderFromTaskCardAction } from "../_actions/update-project-tasks-order-from-task-card.action";
const taskFormSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(25),
  description: z.string().min(3).max(50),
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
  isCurrentUserAdmin,
}: {
  task: TaskDto;
  project: ProjectDto;
  projectUsers: UserDto[];
  isTaskOpen: boolean;
  isCurrentUserAdmin: boolean;
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
  ): Record<string, string>[] {
    const changes = [];
    console.log("existingPriority", existingPriority);
    console.log("newPriority", newPriority);
    console.log("existingStatus", existingStatus);
    console.log("newStatus", newStatus);
    console.log("existingCategory", existingCategory);
    console.log("newCategory", newCategory);

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
    console.log("changes", changes);
    // if (changes.length === 1) {
    ///needs to return all to prevent single change from being returned only

    return changes;
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
    console.log("taskOrderChanges", taskOrderChanges);
    if (taskOrderChanges.length !== 0) {
      try {
        for (let i = 0; i < taskOrderChanges.length; i++) {
          console.log("updating task Order Changes: ", i + 1);
          await updateProjectTasksOrderFromTaskCardAction(
            values.projectId,
            values.id,

            taskOrderChanges[i]
          );
        }
      } catch (error) {
        toast.error("Error updating task order");
      }
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
  const priorityOptionsForRadio = [
    { option: "High", color: "text-badgeRed" },
    { option: "Medium", color: "text-badgeYellow" },
    { option: "Low", color: "text-badgeGreen" },
  ];
  const statusOptions = ["Not Started", "Up Next", "In Progress", "Completed"];
  renderCount++;
  return (
    <div className="max-w-[95%] ">
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          method="post"
          className="grid gap-4 w-full max-w-md mr-auto  "
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormControl>
                  <Input
                    className={`header-input text-md max-w-[75%] ${
                      isNameEditing ? "editing" : ""
                    }`}
                    placeholder="Task Name"
                    type="text"
                    maxLength={25}
                    minLength={3}
                    spellCheck="false"
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
              <FormItem className="grid gap-2 mb-0">
                <FormControl>
                  <Textarea
                    className={`description-input max-w-[95%] resize-none ${
                      isDescriptionEditing ? "editing" : ""
                    }`}
                    placeholder="Description"
                    spellCheck="false"
                    {...field}
                    maxLength={50}
                    minLength={3}
                    onClick={handleDescriptionClick}
                    onChange={field.onChange}
                    onBlur={handleDescriptionBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row ">
            <div className="flex flex-1 px-2 items-start">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="grid gap-1 pt-2 max-h-[200px]">
                    <FormLabel className=" text-xs font-bold ">
                      Priority
                    </FormLabel>
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
                              className={
                                "flex items-center justify-start space-x-3 "
                              }
                            >
                              <FormControl>
                                <RadioGroupItem
                                  id={`priority-${priority.option}`}
                                  value={priority.option}
                                  className={cn(
                                    priorityOptionsForRadio.find(
                                      (p) => p.option == priority.option
                                    )?.color,
                                    `scale-150`
                                  )}
                                />
                              </FormControl>{" "}
                              <FormLabel className="font-normal text-xs pb-2">
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
              />
            </div>
            <div className="flex flex-1 px-2  flex-col">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="pb-2">
                    <FormLabel className=" text-xs font-bold">Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions?.map((status, _index) => (
                          <SelectItem
                            className="text-xs "
                            key={_index}
                            value={status}
                          >
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
                  <FormItem className="pb-2">
                    <FormLabel className=" text-xs font-bold ">
                      Category
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="text-xs ">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category, _index) => (
                          <SelectItem
                            className="text-xs "
                            key={_index}
                            value={category}
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex-1 px-2">
                  <FormLabel className="flex  font-bold text-xs align-middle">
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
                            "w-full pl-3 text-left text-xs font-normal",
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
                <FormItem className="flex-1 px-2">
                  <FormLabel className="flex font-bold text-xs  align-middle">
                    Due Date
                  </FormLabel>
                  <Popover
                  // onOpenChange={handleDueDateChange}
                  >
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left text-xs font-normal",
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
          </div>
          <FormField
            control={form.control}
            name="assignees"
            render={({ field }) => (
              <FormItem className="flex px-2 flex-col gap-3">
                <FormLabel className="text-xs font-bold">
                  Users Assigned
                </FormLabel>
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
                    {isCurrentUserAdmin && (
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
                    )}
                  </FormControl>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />{" "}
        </form>
      </Form>{" "}
      {isCurrentUserAdmin && (
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
                  <Dialog open={archivedOpen} onOpenChange={setArchivedOpen}>
                    <DialogTrigger asChild>
                      <FormControl>
                        <Button
                          title="Archive Task"
                          variant="outline"
                          className="h-fit w-fit py-2 px-2 absolute top-0 right-8  border:nav-background hover:border-destructive hover:bg-destructive group"
                        >
                          <ArchiveIcon className="w-4 h-4  group-hover:text-white self-center" />
                          <span className="sr-only">Archive Task Button</span>
                          {/* <Label className="text-xs">Archive Task</Label> */}
                        </Button>
                        {/* <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          "text-muted-foreground"
                        )}
                      >
                        Archive Task
                      </Button> */}
                      </FormControl>
                    </DialogTrigger>
                    <DialogContent className="p-4 rounded-lg border-2 border-primary bg-alert-background backdrop-filter">
                      {/* <Card> */}
                      {/* <CardHeader> */}
                      <Label className="text-center text-xl md:text-2xl">
                        Archive Task
                      </Label>
                      {/* </CardHeader> */}
                      <div className="p-4 mb-2 ">
                        <p className="text-center">
                          {" "}
                          Are you sure you want to archive this task?{" "}
                        </p>
                        <p className="text-center text-xs">
                          It can be retrieved from the archive later.{" "}
                        </p>
                      </div>
                      <div className="w-full flex flex-row justify-evenly">
                        <Button
                          className="text-sm "
                          variant="destructive"
                          onClick={() => {
                            handleArchivedSubmit();
                          }}
                        >
                          Archive
                        </Button>
                        <Button
                          className="text-sm "
                          variant="outline"
                          onClick={() => {
                            handleArchivedCancel();
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                      {/* </Card> */}
                    </DialogContent>
                  </Dialog>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
    </div>
  );
};
