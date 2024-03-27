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
import {
  PlusCircleIcon,
  PlusIcon,
  Search,
  UserSearchIcon,
  XIcon,
} from "lucide-react";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils/getInitials";
import { ProjectDto } from "@/use-cases/project/types";
import { UserDto } from "@/use-cases/user/types";
import { updateTeamUsersAction } from "@/app/team/_actions/update-team-users.action";
// import { updateProjectAdminsAction } from "@/app/PROJECTS-CLEAN/_actions/update-project-admins.action";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

import TeamMemberCardPermissionsSelect from "./TeamMemberCardPermissionsSelect";
import { TeamDto } from "@/use-cases/team/types";

export function TeamMemberTable({
  userId,
  team,
  teamUsers,
  globalUsers,
  projects,
}: {
  userId: string;
  team: TeamDto;
  teamUsers: UserDto[];
  globalUsers: UserDto[];
  projects: ProjectDto[];
}) {
  const router = useRouter();

  const filteredGlobalUsers = globalUsers.filter(
    (user) => !teamUsers.some((tUser) => tUser.id === user.id)
  );

  const [projectTasksInTeam, setProjectTasksInTeam] = useState<string[]>(
    projects.map((project) => project.tasks).flat()
  );
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(
    globalUsers[0]
  );
  const [isOpen, setIsOpen] = useState(false);

  const [globalUsersList, setGlobalUsersList] =
    useState<UserDto[]>(filteredGlobalUsers);
  const [teamUsersList, setTeamUsersList] = useState<UserDto[]>(teamUsers);
  const [teamUsersIdLists, setTeamUsersIdLists] = useState<string[]>(
    teamUsersList.map((user) => user.id)
  );
  console.log("teamUsersIdLists", teamUsersIdLists);
  console.log("teamUsersList", teamUsersList);
  // const teamUsersIdLists = teamUsersList.map((user) => user.id);

  const getUserType = (user: UserDto, projectId: string) => {
    if (user.projectsAsAdmin.includes(projectId)) {
      return "admin";
    } else if (user.projectsAsMember.includes(projectId)) {
      return "member";
    }
  };
  const userHasTasksInTeamProjects = (user: UserDto): boolean => {
    return user.tasks.some((task) => projectTasksInTeam.includes(task));
  };
  const usersTasksInProjectCount = (user: UserDto): number => {
    return user.tasks.filter((task) => projectTasksInTeam.includes(task))
      .length;
  };
  const onUpdateTeamUserFormSubmit = async (isOpen: boolean) => {
    console.log("onUpdateTeamUserFormSubmit", isOpen);
    console.log("teamUsersIdLists", teamUsersIdLists);
    console.log("team.id", team.id);
    await updateTeamUsersAction(
      team.id,
      teamUsersList.map((user) => user.id)
    );
  };
  const getUserTypes = (projectUsers: UserDto[]) => {
    const userTypes: Record<string, string> = {}; // Define userTypes as an object with string index signature
    projectUsers.forEach((user) => {
      userTypes[user.id as string] = getUserType(user, team.id) as string; // Make sure project.id is defined and correct
    });
    return userTypes;
  };

  const [userTypes, setUserTypes] = useState({
    ...getUserTypes(teamUsersList),
  });

  // Function to handle the change in user type
  const handleChange = (userId: string, userType: string) => {
    setUserTypes((prevUserTypes) => ({
      ...prevUserTypes,
      [userId]: userType, // Update the userType for the specific userId
    }));
  };

  return (
    <Popover onOpenChange={onUpdateTeamUserFormSubmit}>
      <PopoverTrigger asChild>
        <div>
          <Search className="w-10 h-10 cursor-pointer hover:bg-primary p-2 rounded-full" />

          <span className="sr-only">Edit Members</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <Command>
          <CommandInput className="h-9" placeholder="Search members..." />
          <CommandGroup>
            <Label className="m-4">
              <div className="font-semibold">Team Members</div>
            </Label>
            {teamUsersList?.map((user, index) => (
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
                        {user.id !== userId && (
                          <Button
                            className="mx-2 hover:bg-red-200"
                            variant="ghost"
                            onClick={() => {
                              if (user.id !== userId) {
                                setSelectedUser(user);
                                if (userHasTasksInTeamProjects(user)) {
                                  // if (user.tasks.length > 0) {
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
                                  // handleUserHasTasks(user);
                                  return;
                                }
                                setTeamUsersList((prev) =>
                                  prev.filter((u) => u.id !== user.id)
                                );
                                setGlobalUsersList((prev) => {
                                  if (!prev.some((u) => u.id === user.id)) {
                                    return [...prev, user];
                                  }
                                  return prev;
                                });
                                toast.success("User removed from Team");
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
            ))}
          </CommandGroup>
          <Separator />
          {globalUsersList.length > 0 && (
            <CommandGroup>
              <Label className="m-4">
                <div className="font-semibold">Global Users</div>
              </Label>
              {globalUsersList?.map((user, index) => (
                <CommandItem className=" group" value={user.name} key={index}>
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
                          setTeamUsersList((prev) => {
                            if (!prev.some((u) => u.id === user.id)) {
                              return [...prev, user];
                            }
                            return prev;
                          });
                          setGlobalUsersList((prev) =>
                            prev.filter((u) => u.id !== user.id)
                          );
                          toast.success("User added to Team");
                        }}
                      >
                        <PlusIcon className=" opacity-0 group-hover:opacity-100 text-green-600"></PlusIcon>
                      </Button>
                    </div>
                  </div>
                  {/* </div> */}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
