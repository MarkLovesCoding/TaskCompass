"use client";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  CommandInput,
  CommandItem,
  CommandGroup,
  Command,
} from "@/components/ui/command-user-search";
import { Dialog } from "@/components/ui/dialog";
import {
  DialogContent,
  DialogPortal,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AvatarFallback, Avatar } from "@/components/ui/avatar";
import { PlusIcon, XIcon } from "lucide-react";

import { getInitials } from "@/lib/utils/getInitials";
import TeamMemberCardPermissionsSelect from "./TeamUserCardPermissionsSelect";
import { addTeamUserAction } from "@/app/team/_actions/add-team-user.action";
import { removeTeamUserAction } from "@/app/team/_actions/remove-team-user.action";
import { ValidationError } from "@/use-cases/utils";

import type { TeamDto } from "@/use-cases/team/types";
import type { ProjectDto } from "@/use-cases/project/types";
import type { UserDto } from "@/use-cases/user/types";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
export function TeamUserTableCommand({
  userId,
  userData,
  team,
  teamUsers,
  projects,
  isCurrentUserAdmin,
}: {
  userId: string;
  userData: UserDto;
  team: TeamDto;
  teamUsers: UserDto[];
  projects: ProjectDto[];
  isCurrentUserAdmin: boolean;
}) {
  //default useEffect to update teamUsersLists and Permissions on render., dependant on users data
  //check on mongodb if permissions updates right away on save.
  // might be better to filter global users in api ...

  const [projectTasksInTeam, setProjectTasksInTeam] = useState<string[]>(
    projects.map((project) => project.tasks).flat()
  );
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(
    teamUsers[0]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isRemoveUserOpen, setIsRemoveUserOpen] = useState(false);

  const [teamUsersList, setTeamUsersList] = useState<UserDto[]>(teamUsers);
  const [teamUsersIdLists, setTeamUsersIdLists] = useState<string[]>(
    teamUsersList.map((user) => user.id)
  );

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
    try {
      await addTeamUserAction(team.id, user.id);
      toast.success(user.name + " added to Team");
    } catch (err: any) {
      if (err instanceof ValidationError) {
        toast.error("Validation error: " + err.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(
          "An unknown error occurred while adding user to team. Please try again."
        );
      }
    }
  };
  const onRemoveTeamUserSubmit = async (user: UserDto) => {
    try {
      await removeTeamUserAction(team.id, user.id);
      toast.success(user.name + " removed from Team");
    } catch (err: any) {
      if (err instanceof ValidationError) {
        toast.error("Validation error: " + err.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(
          "An unknown error occurred while removing team user. Please try again."
        );
      }
    }
  };

  const getUserStatus = (user: UserDto, team: TeamDto) => {
    if (user.id === userId) {
      return "you";
    } else if (team.createdBy === user.id) {
      return "creator";
    } else if (user.teamsAsAdmin.includes(team.id)) {
      return "admin";
    } else {
      return "member";
    }
  };
  const getUserStatusBadgeColor = (user: UserDto, team: TeamDto) => {
    if (user.id === userId) {
      return "bg-primary";
    } else if (team.createdBy === user.id) {
      return "bg-badgePurple";
    } else if (user.teamsAsAdmin.includes(team.id)) {
      return "bg-badgeRed";
    } else {
      return "bg-badgeBlue";
    }
  };
  return (
    <Command className="p-2 py-4 ">
      <CommandInput className="h-9" placeholder="Search users..." />
      <CommandGroup>
        <Label className="m-4">
          <div className="font-semibold">Team Users</div>
        </Label>
        <CommandItem className=" group" value={userData.name}>
          <div className="flex items-center w-full h-14 gap-2">
            <div className="flex w-full overflow-x-auto items-center justify-start gap-2">
              <UserInformationComponent
                user={userData}
                userStatus={getUserStatus(userData, team)}
              />

              <div className="flex flex-row ml-auto ">
                <Badge className="shrink-0 mx-2 bg-primary" variant="secondary">
                  You
                </Badge>
                <Badge
                  className={`shrink-0 mx-2 ${
                    // userData.teamsAsAdmin.includes(team.id)
                    team.createdBy == userData.id
                      ? "bg-badgePurple"
                      : isCurrentUserAdmin
                      ? "bg-badgeRed"
                      : "bg-badgeBlue"
                  }`}
                  variant="secondary"
                >
                  {/* {userPermission}
                   */}
                  {
                    // userData.teamsAsAdmin.includes(team.id)
                    team.createdBy == userData.id
                      ? "Creator"
                      : isCurrentUserAdmin
                      ? "Admin"
                      : "Member"
                  }
                </Badge>
              </div>
            </div>
          </div>
        </CommandItem>
        {teamUsersList.length > 0 && <Separator className="my-2" />}

        {teamUsersList?.map(
          (user, index) =>
            user.id !== userId && (
              <CommandItem className=" group" value={user.name} key={index}>
                <div className="flex items-center w-full h-14 gap-2">
                  <div className="flex w-full overflow-x-auto items-center justify-between gap-2">
                    <div className="flex flex-row space-x-2">
                      <UserInformationComponent
                        user={user}
                        userStatus={getUserStatus(user, team)}
                      />
                    </div>
                    <div className="flex flex-row space-x-2 ml-auto">
                      <div className="flex flex-row mr-auto ">
                        {team.createdBy !== user.id && isCurrentUserAdmin ? (
                          <TeamMemberCardPermissionsSelect
                            user={user}
                            team={team}
                          />
                        ) : (
                          <Badge
                            variant="secondary"
                            className={`shrink-0 ${getUserStatusBadgeColor(
                              user,
                              team
                            )}`}
                          >
                            {capitalizeFirstLetter(getUserStatus(user, team))}
                          </Badge>
                        )}
                      </div>

                      <div className=" opacity-0 group-hover:opacity-100">
                        {/* Removal only valid if
                          - user is not the creator
                          - user is not the current user
                          - current user is an admin
                        */}
                        {user.id !== team.createdBy &&
                          user.id !== userId &&
                          isCurrentUserAdmin && (
                            //dialog for removal of user.
                            //has all funcitnoaliy of button
                            //take userHAsTasksinTeamProjects and UsersTasksInProjectCount into other component.
                            //bring user into component.
                            //bring onRemoveTeamUserSubmit into component.

                            <Dialog
                              open={isRemoveUserOpen}
                              onOpenChange={setIsRemoveUserOpen}
                            >
                              <DialogTrigger>
                                <Button
                                  className="mx-2 hover:bg-red-200"
                                  variant="ghost"
                                >
                                  <XIcon className="mr-auto  text-red-400"></XIcon>
                                </Button>
                              </DialogTrigger>
                              {!userHasTasksInTeamProjects(user) ? (
                                <DialogContent className="p-4 w-[90%] h-fit rounded-lg border-2 border-primary bg-alert-background backdrop-filter">
                                  <Label className="text-center text-lg md:text-xl p-4">
                                    Are you sure you want to remove {user.name}{" "}
                                    from the team?
                                  </Label>
                                  <div className="p-4 mb-2 ">
                                    This will permanently remove {user.name}{" "}
                                    from team. They can be manually re-invited
                                    later.
                                  </div>
                                  <div className="w-full flex flex-row justify-evenly">
                                    <Button
                                      className="text-sm hover:bg-red-600"
                                      variant="destructive"
                                      onClick={() => {
                                        onRemoveTeamUserSubmit(user);

                                        // use state manager in future, separate out above component into own file.
                                        setTeamUsersList((prev) =>
                                          prev.filter((u) => u.id !== user.id)
                                        );

                                        setIsRemoveUserOpen(false);
                                        // updateProjectArchivedAction(archiveProjectFormObject);
                                        // toast.success("Project Activated Successfully!");
                                        // setIsOpen(false);
                                        // handleArchivedSubmit();
                                      }}
                                    >
                                      Remove {user.name}
                                    </Button>
                                    <Button
                                      className="text-sm "
                                      variant="outline"
                                      onClick={() => {
                                        // handleArchivedCancel();
                                        setIsRemoveUserOpen(false);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </DialogContent>
                              ) : (
                                <DialogContent className="p-4 rounded-lg border-2 border-primary bg-alert-background backdrop-filter">
                                  <Label className="text-center text-xl md:text-2xl">
                                    Cannot remove {user.name} from team.
                                  </Label>
                                  <div className="p-4 mb-2 ">
                                    {user.name} still has{" "}
                                    {usersTasksInProjectCount(user)} task
                                    {usersTasksInProjectCount(user) > 1
                                      ? "s"
                                      : ""}{" "}
                                    assigned to them.
                                  </div>
                                  <div className="w-full flex flex-row justify-evenly">
                                    <Button
                                      className="text-sm "
                                      variant="outline"
                                      onClick={() => {
                                        // handleArchivedCancel();
                                        setIsRemoveUserOpen(false);
                                      }}
                                    >
                                      Close
                                    </Button>
                                  </div>
                                </DialogContent>
                              )}
                              {/* </DialogPortal> */}
                            </Dialog>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </CommandItem>
            )
        )}
      </CommandGroup>
    </Command>
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
      case "admin":
        return "bg-badgeRed";
      case "member":
        return "bg-badgeBlue";
      case "you":
        return "bg-primary";
      case "creator":
        return "bg-badgePurple";
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
