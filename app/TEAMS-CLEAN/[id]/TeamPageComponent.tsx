import Link from "next/link";
import { unstable_noStore } from "next/cache";
import { useQuery } from "@tanstack/react-query";
import AddProjectCard from "./AddProjectCard";
import { TeamMemberTable } from "./TeamMemberTable";
import { TeamHeader } from "@/app/TEAMS-CLEAN/[id]/team-header";
import UnarchiveProjectPopover from "./UnarchiveProjectPopover";

import { getInitials } from "@/app/utils/getInitials";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
} from "@/components/ui/card";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleEllipsisIcon, PlusIcon } from "lucide-react";
// import UpdateTeamMembersCard from "./UpdateTeamUsersCard";
import getTeam from "@/data-access/teams/get-team.persistence";
import getAllUsers from "@/data-access/users/get-all-users.persistence";
import getTeamUsers from "@/data-access/users/get-team-users.persistence";
import getTeamProjects from "@/data-access/projects/get-team-projects";
import getUserObject from "@/data-access/users/get-user.persistence";

import type { TeamDto } from "@/use-cases/team/types";
import type { UserDto } from "@/use-cases/user/types";
import type { ProjectDto } from "@/use-cases/project/types";

export async function TeamPageComponent({
  team,
  user,
  userId,
  projects,
  usersList,
  teamUsers,
}: {
  team: TeamDto;
  userId: string;
  user: UserDto;
  projects: ProjectDto[];
  usersList: UserDto[];
  teamUsers: UserDto[];
}) {
  unstable_noStore();
  // const projects = await getTeamProjects(team);
  // const usersList = await getAllUsers();
  // const filteredUsers = usersList.filter(
  //   (user) => !team.members.includes(user.id)
  // );
  // const teamMembers = await getTeamMembers(team.members);

  // const team: TeamDto = await getTeam(teamId);
  // const user: UserDto = await getUserObject(session!.user.id);
  // const projects = await getTeamProjects(team);
  // const usersList = await getAllUsers();
  // const teamUsers = await getTeamUsers(team.users);

  // const { data } = useQuery(["team"], getTeam);
  // const { data: team, isLoading: isTeamLoading } = useQuery({
  //   queryKey: "team",
  //   queryFn: getTeam,
  // });

  // const { data: allUsers, isLoading: isAllUsersLoading } = useQuery({
  //   queryKey: "allUsers",
  //   queryFn: getAllUsers,
  // });

  // const { data: teamUsers, isLoading: isTeamUsersLoading } = useQuery({
  //   queryKey: ["teamUsers"],
  //   queryFn: getTeamUsers,
  // });

  // const { data: teamProjects, isLoading: isTeamProjectsLoading } = useQuery({
  //   queryKey: ["teamProjects"],
  //   queryFn: getTeamProjects,
  // });

  // const { data: userObject, isLoading: isUserObjectLoading } = useQuery({
  //   queryKey: ["userObject"],
  //   queryFn: getUserObject,
  // });
  // if (
  //   isTeamLoading ||
  //   isAllUsersLoading ||
  //   isTeamUsersLoading ||
  //   isTeamProjectsLoading ||
  //   isUserObjectLoading
  // ) {
  //   return <div>Loading...</div>;
  // }

  console.log("team", team);
  const teamId = team.id;
  const archivedProjects = projects.filter((project) => project.archived);
  const isUserAdmin = user.teamsAsAdmin.some((team) => team === teamId);

  const countArchivedProjects = archivedProjects.length;
  const countProjects = projects.length - countArchivedProjects;

  return (
    <div className="flex flex-col w-full  items-center  min-h-[calc(100vh-4rem)">
      <main className="flex flex-1 flex-col max-w-[1400px] gap-4 p-4 md:gap-8 md:p-10">
        <div className="flex flex-row  mb-10  align-middle">
          <div className="text-2xl font-bold">
            <TeamHeader team={team} />
            <div className="flex flex-col">
              <div className="flex flex-row py-4 ">
                <div className="text-lg mr-4 font-bold">
                  Active Projects: {countProjects}
                </div>
                <div className="text-lg  font-bold">
                  Archived Projects: {countArchivedProjects}
                </div>
              </div>
              <div>
                <h2 className="py-2 text-lg font-bold">
                  Team Members <span>: {teamUsers.length}</span>
                </h2>
              </div>
            </div>
            <div className="w-96 flex flex-row">
              {teamUsers.map((member, index) => (
                <Avatar key={index} className=" w-12 h-12">
                  {/* <AvatarImage src={member.avatar} /> */}
                  <AvatarFallback className={`text-sm bg-gray-500`}>
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
              ))}
              <TeamMemberTable
                userId={userId}
                team={team}
                teamUsers={teamUsers}
                globalUsers={usersList}
                projects={projects}
              />
            </div>
          </div>
          {isUserAdmin && (
            <div className="flex flex-row">
              <div className="p-4">
                <Dialog>
                  <DialogTrigger>
                    <PlusIcon className="w-8 h-8 self-center cursor-pointer" />
                    <span className="sr-only">New Project Button</span>
                  </DialogTrigger>
                  <DialogContent className="max-w-[300px]">
                    <AddProjectCard teamId={teamId} />
                  </DialogContent>
                </Dialog>
              </div>
              <div className="p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <CircleEllipsisIcon className="w-8 h-8 self-center cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          Archived Projects
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <ScrollArea>
                              {archivedProjects.length === 0 ? (
                                <div className="p-4">No archived projects</div>
                              ) : (
                                <div className="p-4 flex flex-col">
                                  {projects.map(
                                    (project, project_idx) =>
                                      project.archived && (
                                        <div key={project_idx}>
                                          <UnarchiveProjectPopover
                                            project={project}
                                          />

                                          {project_idx !== 0 ||
                                            (project_idx !==
                                              archivedProjects.length - 1 && (
                                              <Separator className="my-2" />
                                            ))}
                                        </div>
                                      )
                                  )}
                                </div>
                              )}
                            </ScrollArea>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>
        <h3 className="text-lg font-bold">Team Projects</h3>
        <Separator className="mb-4" />
        <div className="grid gap-4 md:grid-cols-3">
          {projects &&
            projects.map(
              (project, project_idx) =>
                project.archived === false && (
                  <Card
                    key={project_idx}
                    className="border rounded-lg flex items-center w-72 border-gray-500 bg-gray-800 shadow-lg hover:shadow-sm"
                  >
                    <Link href={`/PROJECTS-CLEAN/${project.id}`}>
                      <CardHeader>
                        <CardTitle>{project.name}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                    </Link>
                  </Card>
                )
            )}
        </div>
      </main>
    </div>
  );
}
