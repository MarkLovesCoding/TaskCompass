"use client";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ProjectType, TaskType, UserType } from "../types/types";
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
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(5),
  priority: z.number().int(),
  category: z.string().min(1),
  dueDate: z.number().optional(),
  startDate: z.number(),
  project: z.string().min(1),
  label: z.string().min(1),
});

type TaskFormProps = {
  task: TaskType;
  projectId: string;
  userId: string;
  // onSubmit: (data: TaskType) => void;
};

const TaskForm: React.FC<TaskFormProps> = ({ task, projectId, userId }) => {
  const EDITMODE = task._id === "new" ? false : true;

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: EDITMODE ? task.name : "",
      description: EDITMODE ? task.description : "",
      priority: EDITMODE ? task.priority : 1,
      category: EDITMODE ? task.category : "",
      dueDate: EDITMODE ? task.dueDate : undefined,
      startDate: EDITMODE ? task.startDate : Date.now(),
      project: EDITMODE ? task.project : "",
      label: EDITMODE ? task.label : "",
    },
  });

  const { watch } = form;
  // const [formData, setFormData] = useState({
  //   title: !EDITMODE ? "" : task.title,
  //   description: !EDITMODE ? "" : task.description,
  //   priority: !EDITMODE ? 1 : task.priority,
  //   // progress: !EDITMODE ? 0 : task.progress,
  //   status: !EDITMODE ? "not started" : task.status,
  //   category: !EDITMODE ? "Hardware Problem" : task.category,
  //   project: !EDITMODE ? userProjectId : task.project,
  //   assignedTo: !EDITMODE ? userDataId : (task.assignedTo as string),
  // });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const projectValueByWatch = watch("project");

  console.log("__________________P.", projectValueByWatch);
  // useEffect(() => {
  //   console.log(formData);
  // }, [formData]);

  // useEffect(() => {
  //   console.log("selectedProjectObject", selectedProjectObject);
  //   console.log("selectedProjectId", selectedProjectId);
  //   console.log("selectedAssigneeId", selectedAssigneeId);
  //   console.log("selectedAssigneeObject", selectedAssigneeObject);
  //   console.log("assigneesAvailable", assigneesAvailable);
  //   console.log("ProjectsAvailable", ProjectsAvailable);
  // }, []);

  // const handleChange = (
  //   e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  // ) => {
  //   const value = e.target.value;
  //   const name = e.target.name;

  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("VALUES", values);
    console.log("Task", task);
    // e.preventDefault();
    setIsSubmitting(true);
    // IF NOT A NEW task, fetch will be PUT (Update) type, else POST (new)
    if (EDITMODE == true) {
      const res = await fetch(`/api/Tasks/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },

        body: JSON.stringify(values),
      });
      if (!res.ok) console.log("Error fetching api/tasks/id data");
    } else {
      const res = await fetch(`/api/Tasks/`, {
        method: "POST",
        body: JSON.stringify(values),

        headers: {
          "Content-type": "application/json",
        },
      });

      if (!res.ok) {
        console.log("Error fetching api/tasks");
      }
    }
    // }

    router.replace(`/Tasks/User/${userId}`);
    router.refresh();
  };

  const categories = ["Hardware Problem", "Software Problem", "Project"];
  const priorityOptions = ["High", "Medium", "Low"];

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
            {EDITMODE === true ? "Update Task" : "Create New Task"}
          </h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
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
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {EDITMODE === true ? "Update Task" : "Create Task"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default TaskForm;

{
  /* <label>Project</label>
<select
  onChange={handleProjectChange}
  required={true}
  value={selectedProjectId}
>
  {projectsAvailable.map((project, project_idx) => (
    <option key={project_idx} value={project._id as string}>
      {!isDefaultUser && project.isDefault
        ? `${selectedAssigneeObject.name}'s Tasks`
        : project.name}
    </option>
  ))}
</select>

<label>Assign To User:</label>

<select
  name="assignedTo"
  onChange={handleAssigneeChange}
  required={true}
  value={selectedAssigneeId}
>
  {assigneesAvailable?.map((user, user_idx) => (
 
    <option key={user_idx} value={user._id}>
      {user._id == userDataId ? "Me" : user.email}
  
    </option>
  ))}
</select> */
}
