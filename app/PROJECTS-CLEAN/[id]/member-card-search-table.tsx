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
import { CircleEllipsis, PlusCircleIcon, PlusIcon, XIcon } from "lucide-react";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { getInitials } from "@/app/utils/getInitials";
import { ProjectDto } from "@/use-cases/project/types";
import { UserDto } from "@/use-cases/user/types";
import { updateProjectUsersAction } from "@/app/PROJECTS-CLEAN/_actions/update-project-users.action";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { z } from "zod";
import { Label } from "@/components/ui/label";

import toast from "react-hot-toast";
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
  const filteredTeamUsers = teamUsers.filter(
    (user) => !projectUsers.some((pUser) => pUser.id === user.id)
  );
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(
    teamUsers[0]
  );
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
    await updateProjectUsersAction(project.id, projectUsersIdLists);
    router.refresh();
  };
  const getUserTypes = (projectUsers: UserDto[]) => {
    const userTypes: Record<string, string> = {}; // Define userTypes as an object with string index signature
    projectUsers.forEach((user) => {
      userTypes[user.id as string] = getUserType(user, project.id) as string; // Make sure project.id is defined and correct
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
        <div>
          {/* <PlusCircleIcon className="w-10 h-10" /> */}
          <Button
            variant="outline"
            className=" text-xs lg:text-md py-1 m-1 h-8 lg:h-10 lg:px-4 bg-primary-foreground"
          >
            Edit
            {/* <PlusCircleIcon className="w-10 h-10" /> */}
          </Button>
          {/* <CircleEllipsis className="w-10 h-10" /> */}
          <span className="sr-only">Edit Members</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <Command>
          <CommandInput className="h-9" placeholder="Search members..." />
          <CommandGroup>
            <Label className="m-4">
              <div className="font-semibold">Project Members</div>
            </Label>
            {projectUsersList?.map((user, index) => (
              <CommandItem className=" group" value={user.name} key={index}>
                <div className="flex items-center h-14 gap-2">
                  <div className="flex w-full items-center gap-2">
                    <Avatar className=" w-10 h-10">
                      {/* <AvatarImage src={user.avatar} /> */}
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
                        <div className="flex items-center gap-1"></div>
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
          </CommandGroup>
          <Separator />
          {teamUsersList.length > 0 && (
            <CommandGroup>
              <Label className="m-4">
                <div className="font-semibold">Team Members</div>
              </Label>
              {teamUsersList?.map((user, index) => (
                <CommandItem className=" group" value={user.name} key={index}>
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
                        <div className="flex items-center gap-1"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </span>
                      </div>

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
