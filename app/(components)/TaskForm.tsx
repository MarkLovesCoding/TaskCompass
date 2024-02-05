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
  title: z.string().min(1),
  description: z.string().min(5),
  priority: z.number().int(),
  // progress: z.number().int(),
  status: z.string().min(1),
  category: z.string().min(1),
  project: z.string().min(1),
  assignedTo: z.string().min(1),
});

type ExpandedUserType = Omit<UserType, "connections" | "projects"> & {
  connections: UserType[];
  projects: ExpandedProjectType[];
};
type ExpandedProjectType = Omit<ProjectType, "users"> & {
  users: UserType[];
};

const getProjectsForUser = async (userId: string) => {
  const res = await fetch(`/api/Projects/User/${userId}`);
  const { projects } = await res.json();
  return projects;
};
const getUsersForProject = async (projectId: string) => {
  const res = await fetch(`/api/Projects/${projectId}`);
  const { project } = await res.json();
  return project.users;
};
const TaskForm = ({
  task,
  projects,
  userData,
  initialAssignees,
}: {
  task: TaskType;
  projects: ExpandedProjectType[];
  userData: UserType;
  initialAssignees: UserType[];
}) => {
  const EDITMODE = task._id === "new" ? false : true;
  const userDataId = userData.id;

  const userProject = projects.find((project) => {
    return project.isDefault == true;
  });

  const userProjectId = userProject && userProject._id;
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: !EDITMODE ? "" : task.title,
      description: !EDITMODE ? "" : task.description,
      priority: !EDITMODE ? 1 : task.priority,
      // progress: 0,
      status: !EDITMODE ? "not-started" : task.status,
      category: !EDITMODE ? "Hardware Problem" : task.category,
      project: !EDITMODE ? (userProjectId as string) : (task.project as string),
      assignedTo: !EDITMODE ? userDataId : (task.assignedTo as string),
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

  const [selectedProjectObject, setSelectedProjectObject] =
    useState(userProject);
  const [selectedProjectId, setSelectedProjectId] = useState(
    userProject!._id as string
  );
  const [selectedAssigneeId, setSelectedAssigneeId] = useState(userDataId);
  const [selectedAssigneeObject, setSelectedAssigneeObject] =
    useState(userData);
  const [isDefaultUser, setIsDefaultUser] = useState(true);

  const [assigneesAvailable, setAssigneesAvailable] =
    useState(initialAssignees);
  const [projectsAvailable, setProjectsAvailable] = useState(projects);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const projectValueByWatch = watch("project");
  const assignedToValueByWatch = watch("assignedTo");
  console.log("__________________P.", projectValueByWatch);
  console.log("__________________A.", assignedToValueByWatch);
  // useEffect(() => {
  //   console.log(formData);
  // }, [formData]);
  useEffect(() => {
    const fetchProjectsForUser = async () => {
      const projectsForUsers = await getProjectsForUser(selectedAssigneeId);
      console.log("projectsForUsers", projectsForUsers);
      const sharedProjects = projectsForUsers.filter((project: any) => {
        return (
          project.isDefault == false &&
          projects.some((g) => g._id == project._id)
        );
      });
      const defaultPersonalProjects = projectsForUsers.filter(
        (project: any) => project.isDefault
      );
      const combinedProjects = [...sharedProjects, ...defaultPersonalProjects];
      console.log("SHARED ProjectS:::", sharedProjects);
      console.log(" defaultPersonalProjects:::", defaultPersonalProjects);
      const setDefProjectTemp = defaultPersonalProjects.filter(
        (project: ExpandedProjectType) =>
          project.users.some((user) => user._id == selectedAssigneeId)
      );
      console.log(" combinedProjects:::", combinedProjects);
      console.log(" setDefProjectTemp:::", setDefProjectTemp);
      setProjectsAvailable(combinedProjects);

      // setFormData((prevFormData) => ({
      //   ...prevFormData,
      //   project: selectedProjectId,
      // }));
    };
    fetchProjectsForUser();
    // handleAssigneeChange();
  }, [selectedAssigneeId]);

  useEffect(() => {
    console.log("SELECTED ID IN USE EFFECT:", selectedProjectId);
    const fetchUsersForProject = async () => {
      const usersForProject = await getUsersForProject(selectedProjectId);
      console.log("usersForProject", usersForProject);
      console.log("initialAssignees", initialAssignees);
      //Create assignees project of unique users, filter to prevent duplication of objects.
      const newAssigneeProject = [
        ...initialAssignees,
        ...usersForProject.filter(
          (user: UserType) =>
            !initialAssignees.some((assignee) => assignee._id == user._id)
        ),
      ];
      console.log("newAssigneeProject", newAssigneeProject);

      setAssigneesAvailable(newAssigneeProject);
    };

    fetchUsersForProject();
  }, [selectedProjectId]);
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
  useEffect(() => {
    handleProjectChange();
  }, [projectValueByWatch]);
  useEffect(() => {
    handleAssigneeChange();
  }, [assignedToValueByWatch]);
  const handleProjectChange = () => {
    const valueOfSelectedProject = projectValueByWatch;
    setSelectedProjectId(valueOfSelectedProject);
    console.log("SELECTED Project______", valueOfSelectedProject);

    const projectData = projectsAvailable?.find(
      (project) => project._id === valueOfSelectedProject
    );
    setSelectedProjectObject(projectData);

    if (valueOfSelectedProject === userProjectId) {
      setAssigneesAvailable(initialAssignees);
    } else {
      //appears as wrong Project?
      console.log("Project DATA TO GET USERS FROM?", projectData);
      console.log("userProjectId", userProjectId);
      console.log("selectedProjectId", valueOfSelectedProject);
    }

    // WATCH
    // setFormData((prevFormData) => ({
    //   ...prevFormData,
    //   project: valueOfSelectedProject,
    //   assignedTo: selectedAssigneeId,
    // }));

    // setSelectedAssignee(defaultAssignedToId);
  };

  const handleAssigneeChange = () => {
    const assigneeValue = assignedToValueByWatch;
    setSelectedAssigneeId(assigneeValue);
    console.log("SELECTED ASSIGNEE______+++++++++++++++", assigneeValue);
    // setSelectedAssigneeId(selectedAssigneeId);
    const assigneeData = assigneesAvailable?.find(
      (assignee) => assignee._id === assigneeValue
    );
    assigneeValue == userDataId
      ? setIsDefaultUser(true)
      : setIsDefaultUser(false);

    setSelectedAssigneeObject(assigneeData!);
    console.log("assigneeDAta::", assigneeData);

    // WATCH

    // setFormData((prevFormData) => ({
    //   ...prevFormData,
    //   assignedTo: assigneeValue,
    // }));
    // console.log("FORM DATA UPDATE:::", formData);
  };
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

    router.replace(`/Tasks/User/${userDataId}`);
    router.refresh();
  };

  const categories = ["Hardware Problem", "Software Problem", "Project"];

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          method="post"
          className="grid gap-6 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800"
        >
          <h2 className="text-lg font-semibold text-gray-700 dark:text-white">
            {EDITMODE == true ? "Update Task" : "Create New Task"}
          </h2>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          {/* <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              onChange={handleChange}
              placeholder="Enter task title"
              required={true}
              value={formData.title}
              name="title"
            />
          </div> */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          {/* <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              className="min-h-[100px]"
              id="description"
              onChange={handleChange}
              placeholder="Enter task description"
              required={true}
              value={formData.description}
              name="description"
            />
          </div> */}{" "}
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
                {/* <FormDescription>
                  You can manage categories in your
                  <Link href="/examples/forms">project settings</Link>.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <RadioGroup
                    name="status"
                    id="status"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem id="not-started" value="not-started" />
                      </FormControl>
                      <FormLabel className="font-normal">Not Started</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          id="status-in-progress"
                          value="in-progress"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">In Progress</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem
                          id="status-completed"
                          value="completed"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Completed</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
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
                    {[1, 2, 3, 4, 5].map((priority) => {
                      return (
                        <Fragment key={priority}>
                          <FormItem className="flex  flex-col items-center  space-y-2">
                            <FormLabel className="font-normal">
                              {priority}
                            </FormLabel>

                            <FormControl>
                              <RadioGroupItem
                                id={`"priority-${priority}`}
                                value={priority as unknown as string}
                              />
                            </FormControl>
                          </FormItem>
                        </Fragment>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignee</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  {/* <Select onValueChange={field.onChange} value={field.value}> */}
                  <FormControl>
                    <SelectTrigger id="assignee">
                      <SelectValue placeholder="Select an assignee" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {assigneesAvailable?.map((user, user_idx) => (
                      //@ts-ignore
                      <SelectItem key={user_idx} value={user._id}>
                        {user._id == userDataId ? "Me" : user.email}
                        {/* {user.email} */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* <FormDescription>
                  You can manage categories in your
                  <Link href="/examples/forms">project settings</Link>.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="project"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger id="project">
                      <SelectValue placeholder="Select a Project" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {projectsAvailable.map((project, project_idx) => (
                      <SelectItem
                        key={project_idx}
                        value={project._id as string}
                      >
                        {!isDefaultUser && project.isDefault
                          ? `${selectedAssigneeObject.name}'s Tasks`
                          : project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* <FormDescription>
                You can manage categories in your
                <Link href="/examples/forms">project settings</Link>.
              </FormDescription> */}
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
