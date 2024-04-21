"use client";
import Link from "next/link";
import { unstable_noStore } from "next/cache";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import AddProjectCard from "./AddProjectCard";
import { TeamUserSearchTable } from "./TeamUserSearchTable";
import { TeamHeader } from "@/app/team/[id]/TeamHeader";
import UnarchiveProjectPopover from "./UnarchiveProjectPopover";
import { TeamUserCardWithPermissions } from "./TeamUserCardWithPermissions";
import { getInitials } from "@/lib/utils/getInitials";

import {
  UserIcon,
  UserCog,
  ArchiveIcon,
  Scroll,
  ImageIcon,
} from "lucide-react";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
} from "@/components/ui/dashboard-card";
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
import Image from "next/image";
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
import { updateTeamBackgroundAction } from "../_actions/update-team-background.action";
import { Label } from "@/components/ui/label";

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
  const PER_PAGE = 12;
  const [selectedImages, setSelectedImages] = useState<any[]>([]);
  const [imagesLoadPage, setImagesLoadPage] = useState<number>(1);

  const loadImageSetonOpen = async (bool: boolean) => {
    // isImagesDialogOpen = bool;
    if (bool) {
      await loadNextImageSet();
    }
  };

  const loadNextImageSet = async () => {
    const nextPage = imagesLoadPage + 1;
    const showPage = imagesLoadPage == 1 ? 1 : nextPage;
    // await apiSearchNext(nextPage);
    await fetch("/api/unsplash", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page: showPage, perPage: PER_PAGE }),
      cache: "no-cache",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setSelectedImages((prev) => {
          return [...prev, ...data];
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setImagesLoadPage(nextPage);
  };
  type TUrls = {
    full: string;
    large: string;
    regular: string;
    raw: string;
    small: string;
    thumb: string;
  };
  const setNewBackground = async (urls: TUrls) => {
    setTeamBackgroundImage(urls.full);
    await updateTeamBackgroundAction(team.id, urls.full, urls.small);
  };

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
                    <Dialog onOpenChange={loadImageSetonOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="group hover:bg-accent justify-center flex "
                        >
                          <Label className=" flex ">Change Background</Label>
                          <ImageIcon className="w-6 h-6 ml-3 self-center group-hover:text-primary" />
                          <span className="sr-only">
                            Change Background Button
                          </span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="border-2 w-[80%]  bg-drawer-background backdrop-blur  p-4 border-nav-background">
                        <div className="flex flex-col h-fit overflow-auto">
                          <h1 className="font-bold text-lg w-full text-center">
                            Customize Background
                          </h1>
                          <div className="flex flex-wrap justify-center h-[300px] p-2">
                            {selectedImages.length > 0 ? (
                              selectedImages.map((image: any, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="relative max-w-[120px] max-h-[80px] m-1 overflow-y-clip cursor-pointer hover:border-white border-2 truncate text-ellipsis group"
                                  >
                                    <Image
                                      onClick={() =>
                                        setNewBackground(image.urls)
                                      }
                                      src={image.urls.thumb}
                                      alt="Background Image"
                                      width={120}
                                      height={80}
                                      className={`${
                                        image.width / image.height > 1.5
                                          ? "w-auto h-[80px]"
                                          : "w-[120px] h-auto"
                                      }  overflow-clip rounded cursor-pointer z-40 `}
                                    />
                                    {/* <div className="w-full h-full absolute top-0 left-0 z-30 bg-black/10 group-hover:bg-black/0"></div> */}
                                    <Link
                                      href={image.user.links.html}
                                      className=" w-full absolute h-[20px]  bg-black/30 z-40 hover:bg-black/60 top-[60px] left-[0px]  truncate text-ellipsis "
                                      title={image.user.name}
                                    >
                                      <p className="  px-2 text-xs truncate text-ellipsis">
                                        {image.user.name}
                                      </p>
                                    </Link>
                                    {/* <p>{image.url.full}</p> */}
                                  </div>
                                );
                              })
                            ) : (
                              <div className="flex justify-center">
                                <p>Loading Images...</p>
                              </div>
                            )}
                            <div className="min-w-full py-4 flex justify-center">
                              <Button
                                onClick={loadNextImageSet}
                                className="w-28 px-1 "
                              >
                                More Images...
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
