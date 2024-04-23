"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddTeamCard from "./AddTeamCard";

import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
} from "@/components/ui/dashboard-card";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { PlusIcon } from "lucide-react";
import ArchivedProjectCardWithUnarchiveAction from "./UnarchiveProjectCard";
import type { UserDto } from "@/use-cases/user/types";
import type { ProjectDto } from "@/use-cases/project/types";
import type { TeamDto } from "@/use-cases/team/types";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils/getInitials";
import { Badge } from "@/components/ui/badge";
import { TaskDto } from "@/use-cases/task/types";

import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackgroundImageMenu from "./BackgroundImageMenu";

export function UserPageComponent({
  user,
  usersTeamsAsMember,
  usersTeamsAsAdmin,
  usersProjectsAsMember,
  usersProjectsAsAdmin,
  userTasks,
}: {
  user: UserDto;
  usersTeamsAsMember: TeamDto[];
  usersTeamsAsAdmin: TeamDto[];
  usersProjectsAsMember: ProjectDto[];
  usersProjectsAsAdmin: ProjectDto[];
  userTasks: TaskDto[];
}) {
  const userTasksCompleted = userTasks.filter(
    (task) => task.status === "completed"
  );
  const userTasksInProgress = userTasks.filter(
    (task) => task.status !== "completed"
  );
  const getProjectsTeamName = (projectId: string) => {
    const team = [...usersTeamsAsAdmin, ...usersTeamsAsMember].find((team) =>
      team.projects.includes(projectId)
    );
    return team ? team.name : "";
  };

  //Background Image
  const [backgroundImage, setBackgroundImage] = useState<string>(
    user.backgroundImage
  );

  useEffect(() => {
    setBackgroundImage(user.backgroundImage);
  }, [user.backgroundImage]);

  return (
    <div className="absolute flex flex-col top-[2em] md:top-[3em] w-full h-[calc(100vh-2em)] md:h-[calc(100vh-3em)]">
      <main
        style={
          backgroundImage
            ? {
                backgroundImage: "url(" + backgroundImage + ")",
                backgroundSize: "cover",
                backgroundPosition: " center",
                backgroundRepeat: "no-repeat",
              }
            : {}
        }
        className="flex  items-center bg-gradient-background-light dark:bg-gradient-background-dark overflow-x-hidden flex-col  h-[calc(100vh-2em)] md:h-[calc(100vh-3em)]  md:gap-8 "
      >
        <div className="z-20   w-full flex flex-col items-center self-center  pl-8 p-1 bg-accordion-background backdrop-blur shadow-md space-y-4  ">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="summary">
              <AccordionTrigger>
                <div className="flex items-center space-x-3 my-2">
                  <Avatar className="w-10 h-10 bg-orange-500">
                    {/* <AvatarImage alt={user.name} src="@/public/default-avatar.jpg" /> */}
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <p className="text-base md:text-lg font-bold">
                    {user.name}
                    {`'s Dashboard`}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-row bg-transparent justify-between">
                  <div className="flex flex-col md:flex-row md:flex-wrap md:justify-stretch md:mx-[12%] ">
                    <div className="mb-4 md:w-1/3">
                      <div className="ml-auto flex flex-wrap items-center ">
                        <Label className="font-bold text-sm md:text:sm pb-4">
                          Your Tasks:
                        </Label>
                      </div>
                      <div className="ml-auto flex flex-wrap items-center ">
                        <Badge className="bg-badgeRed  min-w-fit text-xs px-2 py-[0.2em] m-1">{`${userTasks.length} assigned`}</Badge>
                        <Badge className="bg-badgeOrange  min-w-fit text-xs px-2 py-[0.2em] m-1">{`${userTasksInProgress.length} in progress`}</Badge>
                        <Badge className="bg-badgeGreen  min-w-fit text-xs px-2 py-[0.2em] m-1 ">{`${userTasksCompleted.length} completed`}</Badge>
                      </div>
                    </div>
                    <div className="mb-4 md:w-1/3">
                      <div className="ml-auto flex flex-wrap items-center ">
                        <Label className="font-bold text-sm md:text:sm pb-4">
                          Your Teams:
                        </Label>
                      </div>
                      <div className="ml-auto flex flex-wrap items-center ">
                        <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1 bg-badgeRed ">{` Admin: ${usersTeamsAsAdmin.length}`}</Badge>

                        <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1  bg-badgeBlue ">{` Member: ${usersTeamsAsMember.length}`}</Badge>
                      </div>
                    </div>
                    <div className="mb-4 md:w-1/3">
                      <div className="ml-auto flex flex-wrap items-center2">
                        <Label className="font-bold text-sm md:text:sm pb-4">
                          Your Projects:
                        </Label>
                      </div>
                      <div className="ml-auto flex flex-wrap items-center ">
                        <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1  bg-badgeRed ">{` Admin: ${usersProjectsAsAdmin.length}`}</Badge>
                        <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1  bg-badgeBlue">{` Member: ${usersProjectsAsMember.length}`}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className="mb-4 md:w-1/6">
                      <BackgroundImageMenu type={"User"} object={user} />
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="z-20 flex justify-center  self-center  m-4 w-full">
          <Tabs
            defaultValue="teams"
            className="flex mt-0 p-8 bg-accordion-background backdrop-blur rounded-lg justify-center self-center w-fit   flex-col "
          >
            <TabsList className="self-center">
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>
            <TabsContent value="teams">
              <div className=" z-20 flex-grow mt-2 flex w-full md:max-w-[60vw] md:mr-4 flex-col md:justify-start">
                <div className="flex  max-w-[90vw] p-2 justify-start ml-[10%] md:ml-0 my-4 h-[40px] align-top ">
                  <h1 className="text-lg md:text-xl font-bold mr-6 self-center">
                    Your Teams
                  </h1>
                  <Dialog>
                    <DialogTrigger className="h-fit flex self-center">
                      <Button
                        title="Add New Team"
                        className="rounded-full  ml-auto w-fit px-4"
                        size="icon"
                      >
                        New Team
                        <PlusIcon className="w-4 h-4 ml-4" />
                        <span className="sr-only">New Team Button</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[280px]">
                      <AddTeamCard />
                    </DialogContent>
                  </Dialog>
                </div>

                <div className=" flex max-w-[90vw] justify-center md:justify-start flex-row flex-wrap">
                  {usersTeamsAsAdmin &&
                    usersTeamsAsAdmin.map((team, team_idx) => {
                      return (
                        <Card
                          key={team_idx}
                          style={
                            team.backgroundImageThumbnail?.length > 0
                              ? {
                                  backgroundImage:
                                    "url('" +
                                    team.backgroundImageThumbnail +
                                    "')",
                                  backgroundSize: "cover",
                                  backgroundPosition: " center",
                                  backgroundRepeat: "no-repeat",
                                }
                              : {}
                          }
                          className=" hover:border-orange-300  relative border-2 mb-4 max-w-full mr-4 md:mb-4 flex items-center w-72 h-28 bg-card shadow-lg hover:shadow-sm"
                        >
                          <div className="z-30 absolute  top-0 left-0 w-full h-full bg-black/40"></div>
                          <Link
                            className="w-full h-full p-2 z-40"
                            href={`/team/${team.id}`}
                          >
                            <div className=" flex justify-end">
                              <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-badgeRed ">{`Admin`}</Badge>
                            </div>

                            <CardHeader className="p-0 pl-2">
                              <CardTitle className="text-sm md:text-base text-imageThumbText">
                                {team.name}
                              </CardTitle>
                              <CardDescription className="text-xs text-ellipsis text-imageThumbText">
                                <Badge className="  min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-badgeYellow ">
                                  {`Users:  ${team.users.length}`}
                                </Badge>
                                <Badge className="  min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-badgePurple ">
                                  {`Projects:  ${team.projects.length}`}
                                </Badge>
                              </CardDescription>{" "}
                            </CardHeader>
                          </Link>
                        </Card>
                      );
                    })}

                  {usersTeamsAsMember &&
                    usersTeamsAsMember.map((team, team_idx) => {
                      return (
                        <Card
                          key={team_idx}
                          style={
                            team.backgroundImageThumbnail?.length > 0
                              ? {
                                  backgroundImage:
                                    "url('" +
                                    team.backgroundImageThumbnail +
                                    "')",
                                  backgroundSize: "cover",
                                  backgroundPosition: " center",
                                  backgroundRepeat: "no-repeat",
                                }
                              : {}
                          }
                          className=" mb-4 hover:border-orange-300 relative border-2  max-w-full flex  mr-4 items-center w-72 h-28 bg-card shadow-lg hover:shadow-sm"
                        >
                          <div className="z-30 absolute  top-0 left-0 w-full h-full bg-black/40"></div>
                          <Link
                            className="w-full h-full p-2 z-40"
                            href={`/team/${team.id}`}
                          >
                            <div className=" flex justify-end">
                              <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-badgeBlue ">{`Member`}</Badge>
                            </div>
                            <CardHeader className="p-0 pl-2">
                              <CardTitle className="text-sm md:text-base text-imageThumbText">
                                {team.name}
                              </CardTitle>
                              <CardDescription className="text-xs text-ellipsis text-imageThumbText">
                                <Badge className="  min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-badgeYellow ">
                                  {`Users:  ${team.users.length}`}
                                </Badge>
                                <Badge className="  min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-badgePurple ">
                                  {`Projects:  ${team.projects.length}`}
                                </Badge>
                              </CardDescription>
                            </CardHeader>
                          </Link>
                        </Card>
                      );
                    })}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="projects">
              <div className=" z-20 flex-grow mt-2 flex w-full lg:max-w-[60vw] lg:mr-4 flex-col md:justify-start">
                <div className="flex  max-w-[90vw] p-2 justify-start ml-[10%] md:ml-0 my-4 h-[40px] align-top  ">
                  <h1 className="text-lg md:text-xl font-bold mr-6 self-center">
                    Your Projects
                  </h1>
                </div>

                <div className="flex max-w-[90vw] justify-center md:justify-start flex-row flex-wrap ">
                  {usersProjectsAsAdmin &&
                    usersProjectsAsAdmin.map((project, project_idx) =>
                      project.archived ? (
                        <ArchivedProjectCardWithUnarchiveAction
                          key={project_idx}
                          project={project}
                          team={getProjectsTeamName(project.id)}
                          permission={"admin"}
                        />
                      ) : (
                        <Card
                          key={project_idx}
                          style={
                            project.backgroundImageThumbnail?.length > 0
                              ? {
                                  backgroundImage:
                                    "url('" +
                                    project.backgroundImageThumbnail +
                                    "')",
                                  backgroundSize: "cover",
                                  backgroundPosition: " center",
                                  backgroundRepeat: "no-repeat",
                                }
                              : {}
                          }
                          className="hover:border-orange-300 relative border-2  mb-4 max-w-full  mr-4 md:mb-4 flex items-center w-72 h-28 bg-card shadow-lg hover:shadow-sm"
                        >
                          <div className="z-30 absolute  top-0 left-0 w-full h-full bg-black/40"></div>
                          <Link
                            className="w-full h-full p-2 z-40"
                            href={`/project/${project.id}`}
                          >
                            <CardHeader className="p-0 pl-2">
                              <div className="flex flex-row w-full justify-between">
                                <p className="text-xs text-accent-foreground">
                                  Team: {getProjectsTeamName(project.id)}
                                </p>
                                <div className=" flex justify-end">
                                  <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-badgeRed ">{`Admin`}</Badge>
                                </div>
                              </div>
                              <CardTitle className="text-sm md:text-base text-imageThumbText">
                                {project.name}
                              </CardTitle>
                              <CardDescription className="text-xs text-imageThumbText text-ellipsis">
                                <Badge className="  min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-badgeYellow ">
                                  {`Users:  ${project.users.length}`}
                                </Badge>
                                <Badge className="  min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-badgePurple ">
                                  {`Tasks:  ${project.tasks.length}`}
                                </Badge>
                              </CardDescription>
                            </CardHeader>
                          </Link>
                        </Card>
                      )
                    )}

                  {usersProjectsAsMember &&
                    usersProjectsAsMember.map((project, project_idx) =>
                      project.archived ? (
                        <ArchivedProjectCardWithUnarchiveAction
                          key={project_idx}
                          project={project}
                          team={getProjectsTeamName(project.id)}
                          permission={"member"}
                        />
                      ) : (
                        <Card
                          style={
                            project.backgroundImageThumbnail?.length > 0
                              ? {
                                  backgroundImage:
                                    "url('" +
                                    project.backgroundImageThumbnail +
                                    "')",
                                  backgroundSize: "cover",
                                  backgroundPosition: " center",
                                  backgroundRepeat: "no-repeat",
                                }
                              : {}
                          }
                          key={project_idx}
                          className=" hover:border-orange-300 relative border-2 mb-4 max-w-full mr-4 flex items-center w-72 h-28 bg-card  shadow-lg hover:shadow-sm"
                        >
                          <div className="z-30 absolute  top-0 left-0 w-full h-full bg-black/40"></div>
                          <Link
                            className="w-full h-full p-2z-40"
                            href={`/project/${project.id}`}
                          >
                            <CardHeader className="p-0 pl-2">
                              <div className="flex flex-row w-full justify-between">
                                <p className="text-xs text-accent-foreground">
                                  Team: {getProjectsTeamName(project.id)}
                                </p>
                                <div className=" flex justify-end">
                                  <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-badgeBlue ">{`Member`}</Badge>
                                </div>
                              </div>
                              <CardTitle className="text-sm text-imageThumbText md:text-base">
                                {project.name}
                              </CardTitle>
                              <CardDescription className="text-xs text-ellipsis text-imageThumbText">
                                <Badge className="  min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-badgeYellow ">
                                  {`Users:  ${project.users.length}`}
                                </Badge>
                                <Badge className="  min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-badgePurple ">
                                  {`Tasks:  ${project.tasks.length}`}
                                </Badge>
                              </CardDescription>
                            </CardHeader>
                          </Link>
                        </Card>
                      )
                    )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
