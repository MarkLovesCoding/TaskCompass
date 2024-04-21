"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AddTeamCard from "./AddTeamCard";

import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
} from "@/components/ui/dashboard-card";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { ImageIcon, PlusIcon } from "lucide-react";
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
import { updateUserDashboardBackgroundAction } from "./_actions/update-user-dashboard-background.action";
// get teams
// get projects

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
  const [dashboardBackgroundImage, setDashboardBackgroundImage] =
    useState<string>(user.dashboardBackgroundImage);
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
    setDashboardBackgroundImage(urls.full);
    await updateUserDashboardBackgroundAction(user.id, urls.full);
  };
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const handleScroll = () => {
    if (!imageContainerRef.current) {
      console.log("Ref is not attached");
      return;
    }
    const { scrollTop, scrollHeight, clientHeight } = imageContainerRef.current;
    console.log(scrollTop, scrollHeight, clientHeight);
    if (scrollTop + clientHeight >= scrollHeight) {
      console.log("You have reached the bottom!");
      // loadNextImageSet(); // Uncomment this to load more content
    }
  };
  useEffect(() => {
    const scrollContainer = imageContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []); // Empty dependencies array indicates this runs only once after mounting

  return (
    <div className="absolute flex flex-col top-[2em] md:top-[3em] w-full h-[calc(100vh-2em)] md:h-[calc(100vh-3em)]">
      <main
        style={
          dashboardBackgroundImage
            ? {
                backgroundImage: "url(" + dashboardBackgroundImage + ")",
                backgroundSize: "cover",
                backgroundPosition: " center",
                backgroundRepeat: "no-repeat",
              }
            : {}
        }
        className="flex  items-center bg-gradient-background-light dark:bg-gradient-background-dark overflow-x-hidden flex-col  h-[calc(100vh-2em)] md:h-[calc(100vh-3em)]  md:gap-8 "
      >
        {/* <div className="w-full h-[15vh] bg-card-background absolute top-0 left-0 "></div> */}
        <div className="z-20   w-full flex flex-col items-center self-center  pl-8 p-1 bg-accordion-background backdrop-blur shadow-md space-y-4  ">
          {/* <div className="bg-gray-100 p-4 rounded-lg shadow-md"> */}
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
                {/* <div className="flex flex-col  md:flex-row md:flex-wrap md:justify-between md:space-x-4  "> */}
                <div className="flex flex-row bg-transparent justify-between">
                  {/* <div className="mb-4 md:w-1/4"> */}

                  {/* </div> */}
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
                      <Dialog onOpenChange={loadImageSetonOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="group hover:bg-accent px-2 mr-3"
                          >
                            <Label className="hidden md:flex ">
                              Change Background
                            </Label>
                            <ImageIcon className="w-6 h-6 md:ml-3 self-center group-hover:text-primary" />
                            <span className="sr-only">
                              Change Background Button
                            </span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="border-2 w-[80%]  bg-drawer-background backdrop-blur  p-4 border-nav-background">
                          <div
                            className="flex flex-col h-fit overflow-auto"
                            ref={imageContainerRef}
                          >
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
                                  // +
                                  // ", linear-gradient(215deg, rgba(255,255,255,0.2),rgba(255,255,255,0.1))",
                                  // backgroundBlendMode: "overlay",
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
                                  // +
                                  // ", linear-gradient(215deg, rgba(255,255,255,0.2),rgba(255,255,255,0.1))",
                                  // backgroundBlendMode: "overlay",
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
                                  // +
                                  // ", linear-gradient(215deg, rgba(255,255,255,0.2),rgba(255,255,255,0.1))",
                                  // backgroundBlendMode: "overlay",
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
                                {/* <p className="truncate">{project.description}</p> */}
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
