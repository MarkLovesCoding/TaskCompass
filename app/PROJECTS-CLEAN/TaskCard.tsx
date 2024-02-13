"use client";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
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

import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "@/components/ui/popover";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";

import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectDto } from "@/use-cases/project/types";
import { TaskDto } from "@/use-cases/task/types";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(5),
  priority: z.string().min(1),
  category: z.string().min(1),
  status: z.string().min(1),
  dueDate: z.number().optional(),
  startDate: z.number(),
  project: z.string().min(1),
  label: z.string().min(1),
});

type TaskFormProps = {
  task: TaskDto | "new";
  project: ProjectDto;
  userId: string;
  // onSubmit: (data: TaskType) => void;
};

export const TaskCard: React.FC<TaskFormProps> = ({
  task,
  project,
  userId,
}) => {
  // const EDITMODE = task._id === "new" ? false : true;

  // const router = useRouter();
  const isNewTask = task === "new";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: isNewTask ? "" : task.name,
      description: isNewTask ? "" : task.description,
      priority: isNewTask ? "High" : task.priority,
      status: isNewTask ? "Not Started" : task.status,
      category: isNewTask ? "" : task.category,
      dueDate: isNewTask ? Date.now() + 100000 : task.dueDate,
      startDate: isNewTask ? Date.now() : task.startDate,
      project: project.id,
      label: isNewTask ? "" : task.label,
    },
  });

  const { watch } = form;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const projectValueByWatch = watch("project");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {};

  //   router.replace(`/Tasks/User/${userId}`);
  //   router.refresh();
  // };

  const categories = ["Hardware Problem", "Software Problem", "Project"];
  const priorityOptions = ["High", "Regular", "Low"];
  const statusOptions = ["Not Started", "Up Next", "In Progress", "Completed"];

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
          </h2>
          <Card className="w-full max-w-md p-4 md:p-8 grid gap-4">
            <CardHeader>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter task name"
                        type="text"
                        {...field}
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter task description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardHeader>
            <CardContent className="grid gap-4">
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
                          defaultValue={field.value as unknown as string}
                          className="flex flex-row space-x-1"
                        >
                          {priorityOptions.map((priority) => (
                            <Fragment key={priority}>
                              <FormItem className="flex flex-col items-center space-y-2">
                                <FormLabel className="font-normal">
                                  {priority}
                                </FormLabel>
                                <FormControl>
                                  <RadioGroupItem
                                    id={`priority-${priority}`}
                                    value={priority as unknown as string}
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
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            className="w-full"
                            id="startDate"
                            variant="outline"
                          >
                            <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                            Select Start Date
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar initialFocus mode="single" />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>{" "}
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            className="w-full"
                            id="dueDate"
                            variant="outline"
                          >
                            <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                            Select Due Date
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar initialFocus mode="single" />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="w-full" id="startDate" variant="outline">
                      <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                      Select Start Date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar initialFocus mode="single" />
                  </PopoverContent>
                </Popover>
              </div> */}
              <div className=" items-center gap-2">
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Members</FormLabel>
                      <div className="flex flex-row ">
                        <Avatar className="h-9 w-9 bg-blue-500 border-2 border-blue-400">
                          <AvatarImage alt="User 1" src="/avatar1.jpg" />
                          <AvatarFallback>CH</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-9 w-9 bg-green-500 border-2 border-green-400">
                          <AvatarImage alt="User 2" src="/avatar2.jpg" />
                          <AvatarFallback>HA</AvatarFallback>
                        </Avatar>
                        <Button className="mr-4" size="sm" variant="ghost">
                          <PlusIcon className="w-4 h-4 mr-2" />
                          Add Member
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isNewTask ? "Create Task" : "Update Task"}
          </Button>
        </form>
      </Form>
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
