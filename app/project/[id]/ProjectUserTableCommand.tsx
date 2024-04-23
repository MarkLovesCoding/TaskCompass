"use client";
import { Button } from "@/components/ui/button";

import {
  CommandInput,
  CommandItem,
  CommandGroup,
  Command,
} from "@/components/ui/command-user-search";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, XIcon } from "lucide-react";
import { AvatarFallback, Avatar } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils/getInitials";
import { ProjectDto } from "@/use-cases/project/types";
import { UserDto } from "@/use-cases/user/types";
import { addProjectUserAction } from "@/app/project/_actions/add-project-user.action";
import { removeProjectUserAction } from "@/app/project/_actions/remove-project-user.action";
import { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import ProjectUserPermissionsSelect from "./ProjectUserPermissionsSelect";
import { ValidationError } from "@/use-cases/utils";
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
export function ProjectUserTableCommand({
  userId,
  project,
  teamUsers,
  projectUsers,
  isCurrentUserAdmin,
}: {
  userId: string;
  project: ProjectDto;
  teamUsers: UserDto[];
  projectUsers: UserDto[];
  isCurrentUserAdmin: boolean;
}) {
  const userData = projectUsers.filter((user) => user.id === userId)[0];

  const filteredTeamUsers = teamUsers.filter(
    (user) => !projectUsers.some((pUser) => pUser.id === user.id)
  );
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(
    teamUsers[0]
  );
  const [teamUsersList, setTeamUsersList] =
    useState<UserDto[]>(filteredTeamUsers);
  const [projectUsersList, setProjectUsersList] =
    useState<UserDto[]>(projectUsers);

  useEffect(() => {
    setProjectUsersList(projectUsers);
  }, [projectUsers]);

  const userHasTasksInProject = (user: UserDto, projectId: string): boolean => {
    return user.tasks.some((task) => project.tasks.includes(task));
  };
  const usersTasksInProjectCount = (
    user: UserDto,
    projectId: string
  ): number => {
    return user.tasks.filter((task) => project.tasks.includes(task)).length;
  };

  const onAddProjectUserSubmit = async (user: UserDto) => {
    try {
      await addProjectUserAction(project.id, user.id);
      toast.success("User added to project");
    } catch (err: any) {
      if (err instanceof ValidationError) {
        toast.error("Validation error: " + err.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(
          "An unknown error occurred while adding user to project. Please try again."
        );
      }
    }
  };
  const onRemoveProjectUserSubmit = async (user: UserDto) => {
    try {
      await removeProjectUserAction(project.id, user.id);
      toast.success("User removed from project");
    } catch (err: any) {
      if (err instanceof ValidationError) {
        toast.error("Validation error: " + err.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(
          "An unknown error occurred while removing user from project. Please try again."
        );
      }
    }
  };

  const getUserStatus = (user: UserDto, project: ProjectDto) => {
    if (user.id === userId) {
      return "you";
    } else if (project.createdBy === user.id) {
      return "creator";
    } else if (user.projectsAsAdmin.includes(project.id)) {
      return "admin";
    } else {
      return "member";
    }
  };
  const getUserStatusBadgeColor = (user: UserDto, project: ProjectDto) => {
    if (user.id === userId) {
      return "bg-primary";
    } else if (project.createdBy === user.id) {
      return "bg-badgePurple";
    } else if (user.teamsAsAdmin.includes(project.id)) {
      return "bg-badgeRed";
    } else {
      return "bg-badgeBlue";
    }
  };
  return (
    <>
      <Command>
        <CommandInput className="h-9 " placeholder="Search users..." />
        <CommandGroup>
          <Label className="m-4">
            <div className="font-semibold">Project Users</div>
          </Label>
          <div className="max-h-[40vh]  overflow-auto">
            <CommandItem className=" group" value={userData.name}>
              <div className="flex w-full overflow-x-auto items-center justify-between gap-2">
                <div className="flex flex-row space-x-2">
                  <UserInformationComponent
                    user={userData}
                    userStatus={getUserStatus(userData, project)}
                  />
                </div>
                <div className="flex flex-row space-x-2 ml-auto">
                  <div className="flex flex-row mr-auto ">
                    {" "}
                    <Badge
                      className="shrink-0 mx-2 bg-primary"
                      variant="secondary"
                    >
                      You
                    </Badge>
                    <Badge
                      className={`shrink-0 mx-2 ${
                        project.createdBy == userData.id
                          ? "bg-badgePurple"
                          : isCurrentUserAdmin
                          ? "bg-badgeRed"
                          : "bg-badgeBlue"
                      }`}
                      variant="secondary"
                    >
                      {/* {userPermission}
                       */}
                      {project.createdBy == userData.id
                        ? "Creator"
                        : isCurrentUserAdmin
                        ? "Admin"
                        : "Member"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CommandItem>
            {projectUsersList?.map(
              (user, index) =>
                user.id !== userId && (
                  <CommandItem className=" group" value={user.name} key={index}>
                    <div className="flex items-center w-full h-14 gap-2">
                      <div className="flex w-full overflow-x-auto items-center justify-between gap-2">
                        <div className="flex flex-row space-x-2">
                          <UserInformationComponent
                            user={user}
                            userStatus={getUserStatus(user, project)}
                          />
                        </div>
                        <div className="flex flex-row space-x-2 ml-auto">
                          <div className="flex flex-row mr-auto ">
                            {" "}
                            {project.createdBy !== user.id &&
                            isCurrentUserAdmin ? (
                              <ProjectUserPermissionsSelect
                                user={user}
                                project={project}
                              />
                            ) : (
                              <Badge
                                variant="secondary"
                                className={`shrink-0 ${getUserStatusBadgeColor(
                                  user,
                                  project
                                )}`}
                              >
                                {capitalizeFirstLetter(
                                  getUserStatus(user, project)
                                )}
                              </Badge>
                            )}
                          </div>
                          <div className=" ml-auto">
                            <div className=" opacity-0 group-hover:opacity-100">
                              {user.id !== project.createdBy &&
                                user.id !== userId &&
                                isCurrentUserAdmin && (
                                  <Button
                                    className="mx-2 hover:bg-red-200"
                                    variant="ghost"
                                    onClick={() => {
                                      if (user.id !== userId) {
                                        setSelectedUser(user);
                                        if (
                                          userHasTasksInProject(
                                            user,
                                            project.id
                                          )
                                        ) {
                                          // if (user.tasks.length > 0) {
                                          toast.error(
                                            `User cannot be removed from Project.\n User still has  ${usersTasksInProjectCount(
                                              user,
                                              project.id
                                            )}  task${
                                              usersTasksInProjectCount(
                                                user,
                                                project.id
                                              ) > 1
                                                ? "s"
                                                : ""
                                            } assigned to them.`
                                            // @ts-ignore
                                          );
                                          // handleUserHasTasks(user);
                                          return;
                                        }
                                        onRemoveProjectUserSubmit(user);
                                        setProjectUsersList((prev) =>
                                          prev.filter((u) => u.id !== user.id)
                                        );
                                        setTeamUsersList((prev) => {
                                          if (
                                            !prev.some((u) => u.id === user.id)
                                          ) {
                                            return [...prev, user];
                                          }
                                          return prev;
                                        });
                                        toast.success(
                                          "User removed from Project"
                                        );
                                      }
                                    }}
                                  >
                                    <XIcon className="mr-auto text-red-400"></XIcon>
                                  </Button>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                )
            )}
          </div>
        </CommandGroup>
        <Separator />
        {teamUsersList.length > 0 && (
          <CommandGroup>
            <Label className="m-4">
              <div className="font-semibold">Team Members</div>
            </Label>
            <div className="max-h-[40vh] h-fit overflow-auto">
              {teamUsersList?.map((user, index) => (
                <CommandItem className=" group" value={user.name} key={index}>
                  <div className="flex items-center justify-between w-full  gap-2">
                    <div className="flex items-center w-full gap-2">
                      <UserInformationComponent
                        user={user}
                        userStatus={getUserStatus(user, project)}
                      />

                      <div className="ml-auto">
                        {isCurrentUserAdmin && (
                          <Button
                            variant={"ghost"}
                            className="mx-2 hover:bg-green-200"
                            onClick={() => {
                              onAddProjectUserSubmit(user);
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
                            <PlusIcon className=" opacity-0 group-hover:opacity-100 text-green-600"></PlusIcon>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </div>
          </CommandGroup>
        )}
      </Command>
    </>
  );
}
const UserInformationComponent = ({
  user,
  userStatus,
}: {
  user: UserDto;
  userStatus: "admin" | "member" | "you" | "creator";
}) => {
  const getAvatarColor = (status: typeof userStatus) => {
    switch (status) {
      case "creator":
        return "bg-badgePurple";
      case "you":
        return "bg-primary";
      case "admin":
        return "bg-badgeRed";
      case "member":
        return "bg-badgeBlue";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <Avatar className="w-8 h-8 md:w-10 md:h-10">
        {/* <AvatarImage src={user.avatar} /> */}
        <AvatarFallback
          className={`text-xs md:text-sm ${getAvatarColor(userStatus)}`}
        >
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      <div className="truncate max-w-[80px] mobileMinWidth:max-w-full">
        <span className="font-sm">{user.name}</span>
        <div className="flex items-center gap-1"></div>
        <span className="text-xs truncate text-gray-500 dark:text-gray-400">
          {user.email}
        </span>
      </div>
    </>
  );
};
