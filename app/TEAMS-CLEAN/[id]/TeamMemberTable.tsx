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
import { updateTeamUsersAction } from "@/app/TEAMS-CLEAN/_actions/update-team-users.action";
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
import TeamMemberCardPermissionsSelect from "./TeamMemberCardPermissionsSelect";
import { TeamDto } from "@/use-cases/team/types";
import MemberCardPermissionsSelect from "./TeamMemberCardPermissionsSelect";
const formSchema = z.object({
  users: z.array(z.string()).min(1),
});

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
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     users: [...project.members, ...project.admins],
  //   },
  // });
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
  const [alertOpen, setAlertOpen] = useState(false);

  // useEffect(() => {
  //   const getProjects = async () => {
  //     const projects = await getTeamProjects(team);
  //     const allProjectTasks = projects.map((project) => project.tasks).flat();
  //     setProjectTasksInTeam(allProjectTasks);
  //     console.log("projects", projects);
  //   };
  // }, [team]);

  const [globalUsersList, setGlobalUsersList] =
    useState<UserDto[]>(filteredGlobalUsers);
  const [teamUsersList, setTeamUsersList] = useState<UserDto[]>(teamUsers);
  const teamUsersIdLists = teamUsersList.map((user) => user.id);

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
    // if (selectedUser) {
    //   const updatedUsers = [...form.getValues("Users"), selectedUser];
    //   form.setValue("Users", updatedUsers);
    // }
    // if (isOpen) {
    await updateTeamUsersAction(team.id, teamUsersIdLists);
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
      userTypes[user.id as string] = getUserType(user, team.id) as string; // Make sure project.id is defined and correct
      // }
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
    <Popover onOpenChange={onUpdateTeamUserFormSubmit}>
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
              <div className="font-semibold">Team Members</div>
            </Label>
            {teamUsersList?.map((user, index) => (
              <CommandItem className=" group" value={user.name} key={index}>
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
                        <div className="flex items-center gap-1"></div>
                      </div>
                    </div>
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

                    <div className=" opacity-0 group-hover:opacity-100">
                      {user.id !== userId && (
                        <Button
                          onClick={() => {
                            if (user.id !== userId) {
                              setSelectedUser(user);
                              if (userHasTasksInTeamProjects(user)) {
                                // if (user.tasks.length > 0) {
                                toast.error(
                                  `User cannot be removed from Project.\n User still has  ${usersTasksInProjectCount(
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
          </CommandGroup>
          <Separator />
          {globalUsersList.length > 0 && (
            <CommandGroup>
              <Label className="m-4">
                <div className="font-semibold">Global Users</div>
              </Label>
              {globalUsersList?.map((user, index) => (
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
