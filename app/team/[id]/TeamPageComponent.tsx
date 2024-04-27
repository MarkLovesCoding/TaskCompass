"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { unstable_noStore } from "next/cache";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
} from "@/components/ui/dashboard-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/avatar-scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  UserIcon,
  UserCog,
  ArchiveIcon,
  ImageIcon,
  PlusIcon,
} from "lucide-react";

import { getInitials } from "@/lib/utils/getInitials";
import BackgroundImageMenu from "@/app/dashboard/[id]/BackgroundImageMenu";
import AddProjectCard from "./AddProjectCard";
import { TeamUserSearchTable } from "./TeamUserSearchTable";
import { TeamHeader } from "@/app/team/[id]/TeamHeader";
import UnarchiveProjectPopover from "./UnarchiveProjectPopover";
import { TeamUserCardWithPermissions } from "./TeamUserCardWithPermissions";
import InviteUser from "./InviteUser";

import type { TeamDto } from "@/use-cases/team/types";
import type { UserDto } from "@/use-cases/user/types";
import type { ProjectDto } from "@/use-cases/project/types";

export function TeamPageComponent({
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

  const teamId = team.id;
  const archivedProjects = projects.filter((project) => project.archived);
  const isCurrentUserAdmin = user.teamsAsAdmin.some((team) => team === teamId);
  const countArchivedProjects = archivedProjects.length;
  const countProjects = projects.length - countArchivedProjects;

  const teamUsersAdmins = teamUsers.filter((user) =>
    user.teamsAsAdmin.includes(teamId)
  );
  const teamUsersMembers = teamUsers.filter((user) =>
    user.teamsAsMember.includes(teamId)
  );

  const [teamBackgroundImage, setTeamBackgroundImage] = useState<string>(
    team.backgroundImage
  );
  useEffect(() => {
    setTeamBackgroundImage(team.backgroundImage);
  }, [team.backgroundImage]);

  return (
    <div className=" absolute flex flex-col w-full  items-center top-8 md:top-12 min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] overflow-x-hidden">
      <main
        style={
          teamBackgroundImage
            ? {
                backgroundImage: "url(" + teamBackgroundImage + ")",
                backgroundSize: "cover",
                backgroundPosition: " center",
                backgroundRepeat: "no-repeat",
              }
            : {}
        }
        className="flex bg-gradient-background-light dark:bg-gradient-background-dark overflow-x-hidden w-full flex-col gap-4 min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)]"
      >
        <div className="z-20 overflow-x-clip  w-full px-4  self-center shadow-md   bg-accordion-background backdrop-blur">
          <Accordion type="single" collapsible defaultValue="summary">
            <AccordionItem value="summary">
              <AccordionTrigger>
                <div className="flex w-full">
                  <TeamHeader
                    team={team}
                    isCurrentUserAdmin={isCurrentUserAdmin}
                    userId={userId}
                  />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col pl-8 md:pl-0 md:flex-row md:flex-wrap md:justify-evenly md:mx-[12%] bg-transparent md:border-r-slate-600 ">
                  <div className="mb-4 md:w-1/4">
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
                            <Badge className="bg-badgeGray min-w-fit text-xs px-2 py-[0.2em] m-1">
                              <ArchiveIcon className="w-4 h-4 mr-1 opacity-60" />

                              {`Archived: ${countArchivedProjects}`}
                            </Badge>
                          </PopoverTrigger>
                          <PopoverContent>
                            <ScrollArea>
                              {archivedProjects.length === 0 ? (
                                <div className="">No archived projects</div>
                              ) : (
                                <div className=" flex flex-col">
                                  <Label className="text-center md:text-lg mb-4">
                                    Archived Projects
                                  </Label>
                                  {projects.map(
                                    (project, project_idx) =>
                                      project.archived && (
                                        <div key={project_idx}>
                                          <UnarchiveProjectPopover
                                            project={project}
                                            isCurrentUserAdmin={
                                              isCurrentUserAdmin
                                            }
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

                  <div className="mb-4 md:w-1/4">
                    <div className="ml-auto flex flex-wrap items-center ">
                      <Label className="font-bold mr-16 text-sm md:text:sm pb-">
                        Users:
                      </Label>

                      <TeamUserSearchTable
                        userId={userId}
                        userData={user}
                        team={team}
                        teamUsers={teamUsers}
                        globalUsers={usersList}
                        projects={projects}
                        isCurrentUserAdmin={isCurrentUserAdmin}
                      />
                      <InviteUser
                        team={team}
                        inviter={user}
                        teamUsers={teamUsers}
                      />
                    </div>
                    <div className=" flex flex-col  ">
                      <div>
                        <div className="flex flex-col  w-[225px] mobileLandscape:w-[175px]">
                          <div className="flex flex-row mr-auto items-center space-x-2 ">
                            <UserCog className="min-w-4 min-h-4 mr-1 opacity-60" />
                            <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1 bg-badgeRed ">
                              {` Admins: ${teamUsersAdmins.length}`}
                            </Badge>

                            <div className="flex flex-row w-[225px] mobileLandscape:w-[175px] overflow-y-auto">
                              {teamUsersAdmins.map((member, index) => (
                                <div key={index} className="p-1">
                                  <Popover>
                                    <PopoverTrigger>
                                      <Avatar key={index} className="w-8 h-8 ">
                                        <AvatarFallback
                                          className={` text-xs hover:bg-primary bg-secondary`}
                                        >
                                          {getInitials(member.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="sr-only">
                                        User Avatar
                                      </span>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[calc(100%-3em)] m-4 p-0 border-none">
                                      {/* {isUserAdmin ? ( */}

                                      <TeamUserCardWithPermissions
                                        user={member}
                                        team={team}
                                        isCurrentUserAdmin={isCurrentUserAdmin}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex flex-col  w-[225px] mobileLandscape:w-[175px] ">
                          <div className="flex flex-row mr-auto items-center space-x-2 ">
                            <UserIcon className="min-w-4 min-h-4 mr-1 opacity-60" />
                            <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1 bg-badgeBlue">
                              {` Members: ${teamUsersMembers.length}`}
                            </Badge>
                            <div className="flex flex-row w-[225px] mobileLandscape:w-[175px] overflow-y-auto">
                              {teamUsersMembers.map((member, index) => (
                                <div key={index} className="p-1 ">
                                  <Popover>
                                    <PopoverTrigger>
                                      <Avatar key={index} className=" w-8 h-8">
                                        <AvatarFallback
                                          className={` text-xs hover:bg-primary bg-secondary`}
                                        >
                                          {getInitials(member.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="sr-only">
                                        User Avatar
                                      </span>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[calc(100%-3em)] m-4 p-0 border-none ">
                                      <TeamUserCardWithPermissions
                                        user={member}
                                        team={team}
                                        isCurrentUserAdmin={isCurrentUserAdmin}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center w-full mb-4 md:w-fit">
                    <BackgroundImageMenu type={"Team"} object={team} />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="z-20 flex justify-center  self-center  m-4 w-full">
          <div className=" z-20  mt-2 p-8 bg-accordion-background backdrop-blur rounded-lg flex w-fit md:max-w-fit md:mr-4 flex-col md:justify-start">
            <div className="flex  max-w-[90vw] p-2 justify-center ml-[10%] md:ml-0 my-4 h-[40px] align-top ">
              <h1 className="text-lg md:text-xl font-bold mr-6 self-center">
                Team Projects
              </h1>
              {isCurrentUserAdmin && (
                <Dialog>
                  <DialogTrigger className="h-fit flex self-center">
                    <Button
                      title="Add New Project"
                      className="rounded-full ml-auto w-fit px-4"
                      size="icon"
                    >
                      New Project
                      <PlusIcon className="w-4 h-4 ml-4 " />
                      <span className="sr-only">New Project Button</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[280px]">
                    <AddProjectCard teamId={teamId} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className=" flex max-w-[90vw] self-center justify-center md:justify-start flex-row flex-wrap">
              {projects &&
                projects.map(
                  (project, project_idx) =>
                    project.archived === false && (
                      <Card
                        key={project_idx}
                        style={
                          project.backgroundImageThumbnail?.length > 0
                            ? {
                                backgroundImage:
                                  "url('" +
                                  project.backgroundImageThumbnail +
                                  "')",
                                // +
                                // ", linear-gradient(215deg, rgba(255,255,255,0.2),rgba(255,255,255,0.1))",
                                // backgroundBlendMode: "overlay",
                                backgroundSize: "cover",
                                backgroundPosition: " center",
                                backgroundRepeat: "no-repeat",
                              }
                            : {}
                        }
                        className=" hover:border-orange-300 relative after:bg-white/20 after:absolute after:top-0 after:left-0 after:w-full after:h-ull border-2 mb-4 max-w-full sm:mr-4 flex items-center w-72 h-28 bg-card shadow-lg hover:shadow-sm"
                      >
                        <div className="z-30 absolute top-0 left-0 w-full h-full bg-black/40">
                          {" "}
                        </div>
                        <Link
                          className="w-full h-full p-2 z-40 "
                          href={`/project/${project.id}`}
                        >
                          <CardHeader className="p-0 pl-2">
                            <CardTitle className="text-sm md:text-base text-imageThumbText ">
                              {project.name}
                            </CardTitle>
                            <CardDescription className="text-xs w-full  flex flex-col justify-start text-imageThumbText">
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
                        </Link>
                      </Card>
                    )
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
