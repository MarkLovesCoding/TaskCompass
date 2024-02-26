"use client";
import { Button } from "@/components/ui/button";
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "@/components/ui/popover";
import {
  CommandInput,
  CommandItem,
  CommandGroup,
  Command,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlusCircleIcon, PlusIcon, XIcon } from "lucide-react";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { getInitials } from "@/app/utils/getInitials";
import { ProjectDto } from "@/use-cases/project/types";
import { UserDto } from "@/use-cases/user/types";
import { updateProjectUsersAction } from "@/app/PROJECTS-CLEAN/_actions/update-project-users.action";
// import { updateProjectAdminsAction } from "@/app/PROJECTS-CLEAN/_actions/update-project-admins.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";

import toast from "react-hot-toast";
import { set } from "mongoose";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import MemberCardPermissionsSelect from "./MemberCardPermissionsSelect";
const formSchema = z.object({
  users: z.array(z.string()).min(1),
});

export function MemberCardSearchTable({
  userId,
  project,
  teamUsers,
  projectUsers,
}: {
  userId: string;
  project: ProjectDto;
  teamUsers: UserDto[];
  projectUsers: UserDto[];
}) {
  const router = useRouter();
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     users: [...project.members, ...project.admins],
  //   },
  // });
  const filteredTeamUsers = teamUsers.filter(
    (user) => !projectUsers.some((pUser) => pUser.id === user.id)
  );
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(
    teamUsers[0]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [teamUsersList, setTeamUsersList] =
    useState<UserDto[]>(filteredTeamUsers);
  console.log("teamUsersList", teamUsersList);
  const [projectUsersList, setProjectUsersList] =
    useState<UserDto[]>(projectUsers);
  console.log("projectUsersList", projectUsersList);
  const projectUsersIdLists = projectUsersList.map((user) => user.id);

  const getUserType = (user: UserDto, projectId: string) => {
    if (user.projectsAsAdmin.includes(projectId)) {
      return "admin";
    } else if (user.projectsAsMember.includes(projectId)) {
      return "member";
    }
  };
  const userHasTasksInProject = (user: UserDto, projectId: string): boolean => {
    return user.tasks.some((task) => project.tasks.includes(task));
  };
  const usersTasksInProjectCount = (
    user: UserDto,
    projectId: string
  ): number => {
    return user.tasks.filter((task) => project.tasks.includes(task)).length;
  };
  const onUpdateProjectUserFormSubmit = async (isOpen: boolean) => {
    // if (selectedUser) {
    //   const updatedUsers = [...form.getValues("Users"), selectedUser];
    //   form.setValue("Users", updatedUsers);
    // }
    // if (isOpen) {
    await updateProjectUsersAction(project.id, projectUsersIdLists);
    // await updateProjectAdminsAction(project.id, projectUsersIdLists);
    // await updateProjectMembersAction(project.id, projectMembersIdList, projectAdminsIdList);
    // await updateProjectAdminsAction(project.id, projectAdminsIdLists);
    // }
    //need to check member or admin status
    // setShowUpdateButton(false);
    // setShowCancelButton(false);
    router.refresh();
  };
  const getUserTypes = (projectUsers: UserDto[]) => {
    const userTypes: Record<string, string> = {}; // Define userTypes as an object with string index signature
    projectUsers.forEach((user) => {
      // if (user) {
      userTypes[user.id as string] = getUserType(user, project.id) as string; // Make sure project.id is defined and correct
      // }
    });
    return userTypes;
  };

  const [userTypes, setUserTypes] = useState({
    ...getUserTypes(projectUsersList),
  });

  // Function to handle the change in user type
  const handleChange = (userId: string, userType: string) => {
    setUserTypes((prevUserTypes) => ({
      ...prevUserTypes,
      [userId]: userType, // Update the userType for the specific userId
    }));
  };
  // const { toast } = useToast();
  const toastOptions = {
    duration: 3000,
    position: "top-center",

    // Styling
    style: {},
    className: "",

    // Custom Icon
    icon: "🧐",
    // Change colors of success/error/loading icon
    // iconTheme: {
    //   primary: "#000",
    //   secondary: "#fff",
    // },

    // Aria
    ariaProps: {
      role: "status",
      "aria-live": "polite",
    },
  };
  return (
    <Popover onOpenChange={onUpdateProjectUserFormSubmit}>
      <PopoverTrigger asChild>
        {/* <Button
          className="w-12 h-12 p-3 text-sm rounded-full flex items-center font-semibold gap-1"
          size="icon"
          variant="outline"
        > */}
        <div>
          <PlusCircleIcon className="w-10 h-10" />

          {/* <PlusIcon className="h-4 w-4" /> */}
          <span className="sr-only">Edit Members</span>
        </div>
        {/* </Button> */}
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <Command>
          <CommandInput className="h-9" placeholder="Search members..." />
          <CommandGroup>
            <Label className="m-4">
              <div className="font-semibold">Project Members</div>
            </Label>
            {projectUsersList?.map((user, index) => (
              <CommandItem
                className=" group"
                value={user.name}
                // onSelect={() => {
                //   if (user.id !== userId) {
                //     setSelectedUser(user);
                //     if (userHasTasksInProject(user, project.id)) {
                //       // if (user.tasks.length > 0) {
                //       toast.error(
                //         `User cannot be removed from Project.\n User still has  ${usersTasksInProjectCount(
                //           user,
                //           project.id
                //         )}  task${
                //           usersTasksInProjectCount(user, project.id) > 1
                //             ? "s"
                //             : ""
                //         } assigned to them.`
                //         // @ts-ignore
                //       );
                //       // handleUserHasTasks(user);
                //       return;
                //     }
                //     setProjectUsersList((prev) =>
                //       prev.filter((u) => u.id !== user.id)
                //     );
                //     setTeamUsersList((prev) => {
                //       if (!prev.some((u) => u.id === user.id)) {
                //         return [...prev, user];
                //       }
                //       return prev;
                //     });
                //     // setShowUpdateButton(true);
                //     // setShowCancelButton(true);
                //     toast.success("User removed from Project");
                //   }
                // }}
                key={index}
              >
                <div className="flex items-center h-14 gap-2">
                  <div className="flex w-full items-center gap-2">
                    <Avatar className=" w-10 h-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className={`text-sm bg-gray-500`}>
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className=" gap-4">
                      <div>
                        <div className="flex flex-col justify-start mr-4">
                          <span className="font-medium">{user.name}</span>{" "}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </span>{" "}
                      </div>
                      <div className="col-span-2 flex flex-col justify-center items-end gap-1">
                        <div className="flex items-center gap-1">
                          {" "}
                          {/* //BADGES */}
                          {/* <Badge className="shrink-2 text-xs ">
                            {`${usersTasksInProjectCount(
                              user,
                              project.id
                            )} tasks`}
                          </Badge> */}
                          {/* {user.id == userId ? ( */}
                          {/* <Badge className="shrink-0" variant="secondary">
                            {getUserType(user, project.id)}
                          </Badge> */}
                          {/* ) : ( */}
                          {/* // <Select */}
                          {/* //   defaultValue={userTypes[user.id] || "admin"} */}
                          {/* //   onValueChange={(value) => */}
                          {/* //     handleChange(user.id, value) */}
                          {/* //   } */}
                          {/* // > */}
                          {/* //   <SelectTrigger className="w-[180px]">
                            //     {userTypes[user.id]}
                            //   </SelectTrigger>
                            //   <SelectContent>
                            //     <SelectItem value="admin">Admin</SelectItem>
                            //     <SelectItem value="member">Member</SelectItem>
                            //   </SelectContent>
                            // </Select> */}
                          {/* // )} */}
                        </div>
                      </div>
                    </div>
                    {project.createdBy !== user.id ? (
                      <MemberCardPermissionsSelect
                        user={user}
                        project={project}
                      />
                    ) : (
                      <Badge className="shrink-0" variant="secondary">
                        Admin
                      </Badge>
                    )}
                    {/* <Select defaultValue={getUserType(user, project.id)}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={getUserType(user, project.id)}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select> */}
                    <div className=" opacity-0 group-hover:opacity-100">
                      {user.id !== userId && (
                        <Button
                          onClick={() => {
                            if (user.id !== userId) {
                              setSelectedUser(user);
                              if (userHasTasksInProject(user, project.id)) {
                                // if (user.tasks.length > 0) {
                                toast.error(
                                  `User cannot be removed from Project.\n User still has  ${usersTasksInProjectCount(
                                    user,
                                    project.id
                                  )}  task${
                                    usersTasksInProjectCount(user, project.id) >
                                    1
                                      ? "s"
                                      : ""
                                  } assigned to them.`
                                  // @ts-ignore
                                );
                                // handleUserHasTasks(user);
                                return;
                              }
                              setProjectUsersList((prev) =>
                                prev.filter((u) => u.id !== user.id)
                              );
                              setTeamUsersList((prev) => {
                                if (!prev.some((u) => u.id === user.id)) {
                                  return [...prev, user];
                                }
                                return prev;
                              });
                              // setShowUpdateButton(true);
                              // setShowCancelButton(true);
                              toast.success("User removed from Project");
                            }
                          }}
                        >
                          <XIcon className="mr-auto text-red-400"></XIcon>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CommandItem>
            ))}
            {/* <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <img
                  alt="Avatar"
                  className="rounded-full border border-gray-200 w-8 h-8 object-cover"
                  height="32"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "32/32",
                    objectFit: "cover",
                  }}
                  width="32"
                />
                <div>
                  <span className="font-medium">carol</span>
                  <div className="flex items-center gap-1">
                    <Badge className="shrink-0">5 tasks</Badge>
                    <Badge className="shrink-0" variant="secondary">
                      Member
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    carol@example.com
                  </span>
                </div>
              </div>
            </div> */}
          </CommandGroup>
          <Separator />
          {teamUsersList.length > 0 && (
            <CommandGroup>
              <Label className="m-4">
                <div className="font-semibold">Team Members</div>
              </Label>
              {teamUsersList?.map((user, index) => (
                <CommandItem
                  className=" group"
                  value={user.name}
                  key={index}
                  // onSelect={() => {
                  //   //CHECK IF USER HAS TASKS

                  //   setProjectUsersList((prev) => {
                  //     if (!prev.some((u) => u.id === user.id)) {
                  //       return [...prev, user];
                  //     }
                  //     return prev;
                  //   });
                  //   setTeamUsersList((prev) =>
                  //     prev.filter((u) => u.id !== user.id)
                  //   );
                  //   toast.success("User added to Project");
                  // }}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className=" w-12 h-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className={`text-sm bg-gray-500`}>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">{user.name}</span>
                        <div className="flex items-center gap-1">
                          {/* <Badge className="shrink-0">
                            {`${usersTasksInProjectCount(
                              user,
                              project.id
                            )} tasks`}
                          </Badge> */}
                          {/* <Badge className="shrink-0" variant="secondary">
                            {getUserType(user, project.id)}
                          </Badge> */}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </span>
                      </div>
                      {/* <MemberCardPermissionsSelect
                        user={user}
                        project={project}
                      /> */}
                      {/* <Select defaultValue={getUserType(user, project.id)}>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={getUserType(user, project.id)}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="member">Member</SelectItem>
                        </SelectContent>
                      </Select> */}
                      <div>
                        <Button
                          variant={"ghost"}
                          className="bg-transparent "
                          onClick={() => {
                            setProjectUsersList((prev) => {
                              if (!prev.some((u) => u.id === user.id)) {
                                return [...prev, user];
                              }
                              return prev;
                            });
                            setTeamUsersList((prev) =>
                              prev.filter((u) => u.id !== user.id)
                            );
                            toast.success("User added to Project");
                          }}
                        >
                          <PlusIcon className=" opacity-0 group-hover:opacity-100 text-green-400"></PlusIcon>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
