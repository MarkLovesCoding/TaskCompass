"use client";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
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
  FormDescription,
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
import { cn } from "@/lib/utils";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import * as z from "zod";
import { useWatch } from "react-hook-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectDto } from "@/use-cases/project/types";
import { TaskDto } from "@/use-cases/task/types";
import { format } from "date-fns";
import { createNewTaskAction } from "../_actions/create-new-task.action";
import { updateTaskAction } from "../_actions/update-task.action";
import { Checkbox } from "@/components/ui/checkbox";

import { findAssigneesDifferences } from "@/lib/utils";
import { updateTaskUsersAction } from "../_actions/update-task-users.action";

type TaskFormProps = {
  task: TaskDto | "new";
  project: ProjectDto;
  userId: string;
  // onSubmit: (data: TaskType) => void;
};
type Checked = DropdownMenuCheckboxItemProps["checked"];

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().min(5),
  priority: z.string().min(1),
  category: z.string().min(1),
  status: z.string().min(1),
  dueDate: z.date().optional(),
  startDate: z.date(),
  project: z.string().min(1),
  complete: z.boolean(),
  assignees: z.array(z.string()).min(0),
  label: z.string().min(0).optional(),
});
let renderCount = 0;
export const TaskCard: React.FC<TaskFormProps> = ({
  task,
  project,
  userId,
}) => {
  const projectUsers = project.members;

  console.log("project", project.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUserBar, setShowUserBar] = React.useState<Checked>(true);

  const isNewTask = task === "new";
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: isNewTask ? "" : task.id,
      name: isNewTask ? "New Task Name" : task.name,
      description: isNewTask ? "Describe your task here" : task.description,
      priority: isNewTask ? "Medium" : task.priority,
      status: isNewTask ? "Not Started" : task.status,
      category: isNewTask ? "Other" : task.category,
      dueDate: isNewTask
        ? new Date(new Date().setDate(new Date().getDate() + 7))
        : task.dueDate,
      startDate: isNewTask ? new Date() : task.startDate,
      assignees: isNewTask ? [] : task.assignees,
      complete: isNewTask ? false : task.complete,
      project: project.id,
      label: isNewTask ? "" : task.label,
    },
  });
  const { register, control } = form;
  const selectedStartDate = useWatch({
    control: form.control,
    name: "startDate",
  });
  const selectedDueDate = useWatch({ control: form.control, name: "dueDate" });
  console.log("selectedStartDate", selectedStartDate);
  const currentAssignees = useWatch({
    control: form.control,
    name: "assignees",
  });
  const [existingAssignees, setExistingAssignees] = useState<string[]>([]);

  useEffect(() => {
    if (!isNewTask) {
      setExistingAssignees(task.assignees);
    }
  }, []);
  console.log(currentAssignees);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("form submitted: ", values);
    setIsSubmitting(true);
    if (isNewTask) {
      await createNewTaskAction(values);
    } else {
      await updateTaskAction(values);
      console.log("existingAssignees", existingAssignees);
      console.log("currentAssignees", currentAssignees);
      const { addedAssignees, removedAssignees } = findAssigneesDifferences(
        existingAssignees,
        currentAssignees
      );

      await updateTaskUsersAction(values.id, addedAssignees, removedAssignees);
    }
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    });
  };

  const categories = ["Household", "Personal", "Work", "School", "Other"];
  const priorityOptions = ["High", "Medium", "Low"];
  const statusOptions = ["Not Started", "Up Next", "In Progress", "Completed"];
  renderCount++;
  return (
    <>
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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter task name" type="text" {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter task description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* </CardHeader> */}
          {/* <CardContent className="grid gap-4"> */}
          <div className="grid gap-2">
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
          </div>
          <div className="grid gap-2">
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
          </div>
          <div className="grid gap-2">
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
          </div>
          <div className="grid gap-2">
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
          </div>
          <div className=" items-center gap-2">
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
          </div>
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
            {isNewTask ? "Create Task" : "Save Task"}
          </Button>
        </form>{" "}
      </Form>
      <DevTool control={control} placement="top-left" />
    </>
  );
};

//@ts-expect-error
function CalendarDaysIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}
//@ts-expect-error

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
