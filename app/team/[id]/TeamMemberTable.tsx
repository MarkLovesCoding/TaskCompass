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
import { PlusIcon, Search, XIcon } from "lucide-react";
import { AvatarFallback, Avatar } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils/getInitials";
import { ProjectDto } from "@/use-cases/project/types";
import { UserDto } from "@/use-cases/user/types";
import { updateTeamUsersAction } from "@/app/team/_actions/update-team-users.action";
import { addTeamUserAction } from "@/app/team/_actions/add-team-user.action";
import { removeTeamUserAction } from "@/app/team/_actions/remove-team-user.action";
// import { updateProjectAdminsAction } from "@/app/PROJECTS-CLEAN/_actions/update-project-admins.action";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

import TeamMemberCardPermissionsSelect from "./TeamMemberCardPermissionsSelect";
import { TeamDto } from "@/use-cases/team/types";

export function TeamMemberTable({
  userId,
  userData,
  team,
  teamUsers,
  globalUsers,
  projects,
}: {
  userId: string;
  userData: UserDto;
  team: TeamDto;
  teamUsers: UserDto[];
  globalUsers: UserDto[];
  projects: ProjectDto[];
}) {
  //default useEffect to update teamUsersLists and Permissions on render., dependant on users data
  //check on mongodb if permissions updates right away on save.
  // might be better to filter global users in api ...

  const [filteredGlobalUsers, setFilteredGlobalUsers] = useState<UserDto[]>(
    globalUsers.filter(
      (user) => !teamUsers.some((tUser) => tUser.id === user.id)
    )
  );
  const [projectTasksInTeam, setProjectTasksInTeam] = useState<string[]>(
    projects.map((project) => project.tasks).flat()
  );
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(
    globalUsers[0]
  );
  const [isOpen, setIsOpen] = useState(false);

  const [teamUsersList, setTeamUsersList] = useState<UserDto[]>(teamUsers);
  const [teamUsersIdLists, setTeamUsersIdLists] = useState<string[]>(
    teamUsersList.map((user) => user.id)
  );

  useEffect(() => {
    setFilteredGlobalUsers((prev) =>
      prev.filter((user) => !teamUsers.some((tUser) => tUser.id === user.id))
    );
  }, [userId, teamUsers, globalUsers]);

  useEffect(() => {
    setTeamUsersList(teamUsers);
  }, [teamUsers]); // Update teamUsersList when teamUsers changes
  useEffect(() => {
    setTeamUsersIdLists(teamUsersList.map((user) => user.id));
  }, [teamUsersList]);

  const userHasTasksInTeamProjects = (user: UserDto): boolean => {
    return user.tasks.some((task) => projectTasksInTeam.includes(task));
  };
  const usersTasksInProjectCount = (user: UserDto): number => {
    return user.tasks.filter((task) => projectTasksInTeam.includes(task))
      .length;
  };

  const onAddTeamUserSubmit = async (user: UserDto) => {
    await addTeamUserAction(team.id, user.id);
  };
  const onRemoveTeamUserSubmit = async (user: UserDto) => {
    await removeTeamUserAction(team.id, user.id);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <Search className="w-10 h-10 cursor-pointer hover:bg-primary p-2 rounded-full" />
          <span className="sr-only">Edit Team Users</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <Command>
          <CommandInput className="h-9" placeholder="Search members..." />
          <CommandGroup>
            <Label className="m-4">
              <div className="font-semibold">Team Users</div>
            </Label>
            <CommandItem className=" group" value={userData.name}>
              <div className="flex items-center w-full h-14 gap-2">
                <div className="flex w-full items-center justify-start gap-2">
                  <Avatar className=" w-10 h-10">
                    {/* <AvatarImage src={userData.avatar} /> */}
                    <AvatarFallback className={`text-sm bg-badgeRed`}>
                      {getInitials(userData.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className=" gap-4">
                    <div>
                      <div className="flex flex-col justify-start mr-4">
                        <span className="font-medium">{userData.name}</span>{" "}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {userData.email}
                      </span>{" "}
                    </div>
                    <div className="col-span-2 flex flex-col justify-center items-end gap-1">
                      <div className="flex items-center gap-1"></div>
                    </div>
                  </div>
                  <div className="flex flex-row mr-auto ">
                    <Badge
                      className="shrink-0 mx-2 bg-primary"
                      variant="secondary"
                    >
                      You
                    </Badge>
                    <Badge
                      className={`shrink-0 mx-2 ${
                        userData.teamsAsAdmin.includes(team.id)
                          ? "bg-badgeRed"
                          : "bg-badgeGreen"
                      }`}
                      variant="secondary"
                    >
                      {/* {userPermission}
                       */}
                      {userData.teamsAsAdmin.includes(team.id)
                        ? "Admin"
                        : "Member"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CommandItem>
            <Separator />

            {teamUsersList?.map(
              (user, index) =>
                user.id !== userId && (
                  <CommandItem className=" group" value={user.name} key={index}>
                    <div className="flex items-center w-full h-14 gap-2">
                      <div className="flex w-full items-center justify-start gap-2">
                        <Avatar className=" w-10 h-10">
                          {/* <AvatarImage src={user.avatar} /> */}
                          <AvatarFallback className={`text-sm bg-badgeRed`}>
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
                        <div className="flex flex-row mr-auto ">
                          {team.createdBy !== user.id ? (
                            <TeamMemberCardPermissionsSelect
                              user={user}
                              team={team}
                            />
                          ) : (
                            <Badge className="shrink-0" variant="secondary">
                              Admin
                            </Badge>
                          )}
                        </div>
                        <div className=" ml-auto">
                          <div className=" opacity-0 group-hover:opacity-100">
                            {user.id !== team.createdBy && (
                              <Button
                                className="mx-2 hover:bg-red-200"
                                variant="ghost"
                                onClick={() => {
                                  if (user.id !== userId) {
                                    setSelectedUser(user);
                                    if (userHasTasksInTeamProjects(user)) {
                                      toast.error(
                                        `User cannot be removed from Team.\n User still has  ${usersTasksInProjectCount(
                                          user
                                        )}  task${
                                          usersTasksInProjectCount(user) > 1
                                            ? "s"
                                            : ""
                                        } assigned to them.`
                                        // @ts-ignore
                                      );

                                      return;
                                    }
                                    onRemoveTeamUserSubmit(user);
                                    setTeamUsersList((prev) =>
                                      prev.filter((u) => u.id !== user.id)
                                    );
                                    setFilteredGlobalUsers((prev) => {
                                      if (!prev.some((u) => u.id === user.id)) {
                                        return [...prev, user];
                                      }
                                      return prev;
                                    });
                                    toast.success(
                                      user.name + " removed from Team"
                                    );
                                  }
                                }}
                              >
                                <XIcon className="mr-auto  text-red-400"></XIcon>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                )
            )}
          </CommandGroup>
          <Separator />
          {filteredGlobalUsers.length > 0 && (
            <CommandGroup>
              <Label className="m-4">
                <div className="font-semibold">Global Users</div>
              </Label>
              {filteredGlobalUsers?.map(
                (user, index) =>
                  user.id !== userId && (
                    <CommandItem
                      className=" group"
                      value={user.name}
                      key={index}
                    >
                      {/* <div className="flex items-center gap-2"> */}
                      <div className="flex items-center justify-between w-full gap-2">
                        <div className="flex flex-row gap-2">
                          <Avatar className=" w-10 h-10">
                            {/* <AvatarImage src={user.avatar} /> */}
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
                        </div>

                        <div className="ml-auto">
                          <Button
                            variant={"ghost"}
                            className="mx-2 hover:bg-green-200"
                            onClick={() => {
                              onAddTeamUserSubmit(user);
                              setTeamUsersList((prev) => {
                                if (!prev.some((u) => u.id === user.id)) {
                                  return [...prev, user];
                                }
                                return prev;
                              });
                              setFilteredGlobalUsers((prev) =>
                                prev.filter((u) => u.id !== user.id)
                              );
                              toast.success(user.name + " added to Team");
                            }}
                          >
                            <PlusIcon className=" opacity-0 group-hover:opacity-100 text-green-600"></PlusIcon>
                          </Button>
                        </div>
                      </div>
                      {/* </div> */}
                    </CommandItem>
                  )
              )}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
