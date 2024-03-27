import Link from "next/link";
import { unstable_noStore } from "next/cache";
import { useQuery } from "@tanstack/react-query";
import AddProjectCard from "./AddProjectCard";
import { TeamMemberTable } from "./TeamMemberTable";
import { TeamHeader } from "@/app/team/[id]/team-header";
import UnarchiveProjectPopover from "./UnarchiveProjectPopover";
import { TeamMemberCardWithPermissions } from "./team-member-card-with-permissions";
import { getInitials } from "@/lib/utils/getInitials";

import { UserIcon, UserCog, ArchiveIcon, Scroll } from "lucide-react";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { ScrollArea, ScrollBar } from "@/components/ui/avatar-scroll-area";
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
    <div className=" absolute flex flex-col w-full  items-center top-[3em] min-h-[calc(100vh-3rem)">
      <main className="flex bg-background overflow-x-hidden w-full flex-col gap-4 md:gap-8">
        {/* <div className="w-full h-[15vh] bg-primary-foreground fixed top-[4em] left-0 "></div> */}

        <div className="z-20 overflow-x-clip  w-full px-4  self-center bg-accordian-background  border-b border-secondary-foreground">
          {/* <div className="bg-gray-100 p-4 rounded-lg shadow-md"> */}
          <Accordion type="single" collapsible defaultValue="summary">
            <AccordionItem value="summary">
              <AccordionTrigger>
                <div className="flex w-full">
                  <TeamHeader team={team} />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {/* <Separator className="mb-2 bg-gray-500 h-[1px] mr-16 ml-16 " /> */}
                <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between md:mx-[12%] bg-transparent md:border-r-slate-600">
                  {/* <div className="flex flex-col  justify-between md:flex-row md:flex-wrap md:justify-between md:space-x-4  "> */}
                  {/* <div className="bg-muted mx-2 shadow-sm pl-4 md:flex-grow mb-2  md:max-w-[360px] lg:max-w-[400px] rounded-lg p-3  "> */}
                  <div className="mb-4 md:w-1/4">
                    {/* <div className="ml-auto flex flex-start flex-col flex-wrap space-x-2"> */}
                    <div className="ml-auto flex flex-wrap items-center ">
                      <Label className="font-bold text-sm md:text:sm pb-4">
                        Projects:
                      </Label>
                    </div>
                    <div className="ml-auto flex flex-wrap items-center ">
                      <div className="flex flex-wrap">
                        <Badge className="bg-badgeGreen  min-w-fit text-xs px-2  py-[0.2em] m-1">
                          {" "}
                          {`Active: ${countProjects} `}
                        </Badge>
                        <Popover>
                          <PopoverTrigger className=" ">
                            {/* <div className="flex flex-row items-center space-x-2 p-1  rounded hover:bg-primary-foreground"> */}
                            {/* <div className="flex flex-row mr-auto items-center space-x-2 "> */}
                            <Badge className="bg-badgeGray min-w-fit text-xs px-2 py-[0.2em] m-1">
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
                  {/* <Separator className="my-4 bg-gray-700 h-[1px] space-x-16 md:hidden" />
                  <Separator
                    orientation="vertical"
                    className="hidden my-4 bg-gray-700 md:w-[1px] h-auto mx-4 space-y-16 md:block"
                  /> */}
                  {/* <div
                    className={` bg-muted mb-2 mx-2 shadow-sm pl-4 md:flex-grow rounded-lg p-3 flex md:max-w-[360px] lg:max-w-[400px]  flex-col   `}
                  > */}
                  <div className="mb-4 md:w-1/4">
                    {/* <div className="flex flex-row  justify-between "> */}
                    <div className="ml-auto flex flex-wrap items-center ">
                      <Label className="font-bold mr-16 text-sm md:text:sm pb-">
                        Users:
                      </Label>
                      {/* </div>
                    <div className="ml-auto flex flex-wrap items-center "> */}
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
                            <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1 bg-badgeRed ">
                              {` Admins: ${teamUsersAdmins.length}`}
                            </Badge>
                            {/* </div>
                        <div className=" mb-2 flex flex-row overflow-auto"> */}
                            {/* <> */}
                            <div className="flex flex-row">
                              {teamUsersAdmins.map((member, index) => (
                                <div key={index} className="p-1 py-2 ">
                                  <Popover>
                                    <PopoverTrigger>
                                      <Avatar key={index} className="w-8 h-8 ">
                                        <AvatarFallback
                                          className={` text-xs  rounded-full bg-primary border-2 border-black text-white`}
                                        >
                                          {getInitials(member.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="sr-only">
                                        User Avatar
                                      </span>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[calc(100%-3em)] m-4 p-0 border-2 rounded-lg border-card-foreground shadow-lg">
                                      <TeamMemberCardWithPermissions
                                        user={member}
                                        team={team}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              ))}
                              {/* <ScrollBar orientation="horizontal" /> */}
                            </div>
                          </div>
                          {/* </> */}
                        </div>
                      </div>

                      <div>
                        <div className="flex flex-col  w-[225px] mobileLandscape:w-[175px] ">
                          <div className="flex flex-row mr-auto items-center space-x-2 ">
                            <UserIcon className="w-4 h-4 mr-1 opacity-60" />
                            <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1 bg-badgeBlue">
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

        <div className=" z-20 flex p-4 md:p-10 justify-center self-center flex-col mt-4 w-full">
          <div className=" flex w-full flex-col lg:max-w-[60vw] justify-center">
            <div className="flex ml-[12%] md:ml-0 p-2 justify-start align-top h-fit ">
              <h1 className="text-lg md:text-xl font-bold mr-6 self-center">
                Projects
              </h1>
              <div className="p-4">
                <Dialog>
                  <DialogTrigger>
                    <Button
                      title="Add New Project"
                      className="rounded-full ml-auto"
                      size="icon"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span className="sr-only">New Project Button</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[300px]">
                    <AddProjectCard teamId={teamId} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className=" flex max-w-[90vw] justify-center md:justify-start flex-row flex-wrap">
              {projects &&
                projects.map(
                  (project, project_idx) =>
                    project.archived === false && (
                      <Link
                        key={project_idx}
                        className="truncate m-2 shadow-lg hover:shadow-sm bg-card"
                        href={`/project/${project.id}`}
                      >
                        <Card className="border   p-1 flex items-center w-72 h-28     ">
                          <CardHeader className="p-0 pl-2">
                            <CardTitle className="text-sm md:text-base ">
                              {project.name}
                            </CardTitle>
                            <CardDescription className="text-xs w-full  flex flex-col justify-start">
                              <div className="truncate max-w-full  text-ellipsis ">
                                {project.description}
                              </div>
                              <div className=" flex justify-start pt-2">
                                <Badge className="  min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-badgeYellow ">
                                  {`Users:  ${project.users.length}`}
                                </Badge>
                                <Badge className="  min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-badgePurple">
                                  {`Tasks:  ${project.tasks.length}`}
                                </Badge>
                              </div>
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </Link>
                    )
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
