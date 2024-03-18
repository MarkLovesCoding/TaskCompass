import Link from "next/link";
import { unstable_noStore } from "next/cache";
import { useQuery } from "@tanstack/react-query";
import AddProjectCard from "./AddProjectCard";
import { TeamMemberTable } from "./TeamMemberTable";
import { TeamHeader } from "@/app/TEAMS-CLEAN/[id]/team-header";
import UnarchiveProjectPopover from "./UnarchiveProjectPopover";
import { TeamMemberCardWithPermissions } from "./team-member-card-with-permissions";
import { getInitials } from "@/app/utils/getInitials";

import { UserIcon, UserCog, ArchiveIcon, Scroll } from "lucide-react";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
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
import { Badge } from "@/components/ui/badge";
import type { TeamDto } from "@/use-cases/team/types";
import type { UserDto } from "@/use-cases/user/types";
import type { ProjectDto } from "@/use-cases/project/types";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";

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

  console.log("team", team);
  const teamId = team.id;
  const archivedProjects = projects.filter((project) => project.archived);
  const isUserAdmin = user.teamsAsAdmin.some((team) => team === teamId);

  const countArchivedProjects = archivedProjects.length;
  const countProjects = projects.length - countArchivedProjects;

  const teamUsersAdmins = teamUsers.filter((user) =>
    user.teamsAsAdmin.includes(teamId)
  );
  const teamUsersMembers = teamUsers.filter((user) =>
    user.teamsAsMember.includes(teamId)
  );
  return (
    <div className=" absolute flex flex-col w-full  items-center top-[4em] min-h-[calc(100vh-4rem)">
      <main className="flex bg-background overflow-x-hidden flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="w-full h-[15vh] bg-primary-foreground absolute top-0 left-0 "></div>

        <div className="z-20 overflow-x-clip  min-w-[80vw] px-4 md:min-w-[75%] max-w-[75%] self-center bg-secondary rounded-lg border border-secondary-foreground">
          {/* <div className="bg-gray-100 p-4 rounded-lg shadow-md"> */}
          <Accordion type="single" collapsible defaultValue="summary">
            <AccordionItem value="summary">
              <AccordionTrigger>
                <div className="flex w-full">
                  <TeamHeader team={team} />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Separator className="mb-4 bg-gray-700 h-[1px] space-x-16 " />
                <div className="flex flex-col md:flex-row md:flex-wrap md:justify-evenly  bg-transparent md:border-r-slate-600">
                  <div className="bg-muted   md:flex-grow mb-2  rounded-lg p-2 f  py-2">
                    <div className="ml-auto flex flex-start mdL flex-col flex-wrap space-x-2">
                      <Label className="font-bold min-h-[40px] text-sm md:text:sm">
                        Projects:
                      </Label>
                      <div className="flex flex-wrap">
                        <Badge className="bg-green-500  min-w-fit text-xs px-2  py-[0.2em] m-1">
                          {" "}
                          {`Active: ${countProjects} `}
                        </Badge>
                        <Popover>
                          <PopoverTrigger className=" ">
                            {/* <div className="flex flex-row items-center space-x-2 p-1  rounded hover:bg-primary-foreground"> */}
                            {/* <div className="flex flex-row mr-auto items-center space-x-2 "> */}
                            <Badge className="bg-gray-500  min-w-fit text-xs px-2 py-[0.2em] m-1">
                              <ArchiveIcon className="w-4 h-4 mr-1 opacity-60" />

                              {`Archived: ${countArchivedProjects}`}
                            </Badge>
                            {/* </div> */}
                            {/* </div> */}
                          </PopoverTrigger>
                          <PopoverContent>
                            <ScrollArea>
                              {archivedProjects.length === 0 ? (
                                <div className="">No archived projects</div>
                              ) : (
                                <div className=" flex flex-col">
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
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4 bg-gray-700 h-[1px] space-x-16 md:hidden" />
                  <Separator
                    orientation="vertical"
                    className="hidden my-4 bg-gray-700 md:w-[1px] h-auto mx-4 space-y-16 md:block"
                  />
                  <div
                    className={` bg-muted mb-2 md:flex-grow rounded-lg p-2 flex  flex-col   py-2`}
                  >
                    <div className="flex flex-row  justify-between align-middle">
                      <Label className="font-bold min-h-[40px] text-sm md:text:sm">
                        Users:
                      </Label>

                      <TeamMemberTable
                        userId={userId}
                        team={team}
                        teamUsers={teamUsers}
                        globalUsers={usersList}
                        projects={projects}
                      />
                    </div>
                    <div className=" flex flex-col  ">
                      <div>
                        <div className="flex flex-col  w-[225px] mobileLandscape:w-[175px]">
                          <div className="flex flex-row mr-auto items-center space-x-2 ">
                            <UserCog className="w-4 h-4 mr-1 opacity-60" />
                            <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1 bg-red-500 ">
                              {` Admins: ${teamUsersAdmins.length}`}
                            </Badge>
                            {/* </div>
                        <div className=" mb-2 flex flex-row overflow-auto"> */}
                            {/* <> */}
                            <ScrollArea>
                              {teamUsersAdmins.map((member, index) => (
                                <div key={index} className="p-2">
                                  <Popover>
                                    <PopoverTrigger>
                                      <Avatar key={index} className="w-8 h-8 ">
                                        <AvatarFallback
                                          className={` text-xs  bg-gray-500`}
                                        >
                                          {getInitials(member.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="sr-only">
                                        User Avatar
                                      </span>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[calc(100%-3em)] m-4 p-0 border-none">
                                      <TeamMemberCardWithPermissions
                                        user={member}
                                        team={team}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              ))}
                              <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                          </div>
                          {/* </> */}
                        </div>
                      </div>

                      <div>
                        <div className="flex flex-col  w-[225px] mobileLandscape:w-[175px] ">
                          <div className="flex flex-row mr-auto items-center space-x-2 ">
                            <UserIcon className="w-4 h-4 mr-1 opacity-60" />
                            <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1 bg-green-500 ">
                              {` Members: ${teamUsersMembers.length}`}
                            </Badge>
                            <ScrollArea>
                              {teamUsersMembers.map((member, index) => (
                                <div key={index} className="p-2">
                                  <Popover>
                                    <PopoverTrigger>
                                      <Avatar
                                        key={index}
                                        className=" w-10 h-10"
                                      >
                                        <AvatarFallback
                                          className={`text-sm bg-gray-500`}
                                        >
                                          {getInitials(member.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="sr-only">
                                        User Avatar
                                      </span>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                      <TeamMemberCardWithPermissions
                                        user={member}
                                        team={team}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              ))}
                              <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="text-2xl font-bold">
                    <div className="w-96 flex flex-row">
                      {teamUsers.map((member, index) => (
                        <Avatar key={index} className=" w-12 h-12">
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
                  </div> */}
                  {isUserAdmin && (
                    <div className="flex flex-row">
                      {/* <div className="p-4">
                        <Dialog>
                          <DialogTrigger>
                            <PlusIcon className="w-8 h-8 self-center cursor-pointer" />
                            <span className="sr-only">New Project Button</span>
                          </DialogTrigger>
                          <DialogContent className="max-w-[300px]">
                            <AddProjectCard teamId={teamId} />
                          </DialogContent>
                        </Dialog>
                      </div> */}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex flex-row align-middle">
          <h3 className="text-lg font-bold z-10">Team Projects</h3>
          <div className="p-4">
            <Dialog>
              <DialogTrigger>
                <PlusIcon className="w-8 h-8 p-2 self-center cursor-pointer bg-primary rounded-full" />
                <span className="sr-only">New Project Button</span>
              </DialogTrigger>
              <DialogContent className="max-w-[300px]">
                <AddProjectCard teamId={teamId} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Separator className="mb-4" />
        <div className="grid gap-4 md:grid-cols-3 z-10">
          {projects &&
            projects.map(
              (project, project_idx) =>
                project.archived === false && (
                  <Card
                    key={project_idx}
                    className="border rounded-lg overflow-x-clip flex items-center  border-gray-500 bg-gray-800 shadow-lg w-full hover:shadow-sm"
                  >
                    <Link href={`/PROJECTS-CLEAN/${project.id}`}>
                      <CardHeader>
                        <CardTitle className="text-md md:text-lg flex justify-between w-full ">
                          {project.name}
                          <Badge className=" min-w-fit text-xs px-1 py-[0.2em] m-1 bg-yellow-500 ">
                            {`Users:  ${project.users.length}`}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-ellipsis">
                          {project.description}
                        </CardDescription>
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
