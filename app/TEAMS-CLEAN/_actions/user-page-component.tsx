import Link from "next/link";

import AddTeamCard from "./AddTeamCard";

import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
} from "@/components/ui/dashboard-card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { PlusIcon } from "lucide-react";

import type { UserDto } from "@/use-cases/user/types";
import type { ProjectDto } from "@/use-cases/project/types";
import type { TeamDto } from "@/use-cases/team/types";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/app/utils/getInitials";
import { Badge } from "@/components/ui/badge";
import { TaskDto } from "@/use-cases/task/types";
import { ScrollArea, ScrollBar } from "@/components/ui/dashboard-scroll-area";

import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// get teams
// get projects
export async function UserPageComponent({
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
  return (
    <div className="absolute flex flex-col top-[4em] w-full h-[calc(100vh-4em)]">
      <main className="flex  items-center bg-main-background overflow-x-hidden flex-col  md:gap-8 ">
        {/* <div className="w-full h-[15vh] bg-card-background absolute top-0 left-0 "></div> */}
        <div className="z-20   w-full flex flex-col items-center self-center  pl-8 p-1 bg-drawer-background  border-b border-secondary-foreground space-y-4  ">
          {/* <div className="bg-gray-100 p-4 rounded-lg shadow-md"> */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="summary">
              <AccordionTrigger>
                <div className="flex items-center space-x-3 my-2">
                  <Avatar className="w-10 h-10 bg-orange-500">
                    {/* <AvatarImage alt={user.name} src="@/public/default-avatar.jpg" /> */}
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <p className="text-lg font-bold">Hey {user.name}!</p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col  md:flex-row md:flex-wrap md:justify-between md:space-x-4  ">
                  {/* <div className="mb-4 md:w-1/4"> */}

                  {/* </div> */}
                  <div className="mb-4 md:w-1/4">
                    <div className="ml-auto flex flex-wrap items-center ">
                      <Label className="font-bold text-sm md:text:sm pb-4">
                        Your Tasks:
                      </Label>
                    </div>
                    <div className="ml-auto flex flex-wrap items-center ">
                      <Badge className="bg-gray-500  min-w-fit text-xs px-2 py-[0.2em] m-1">{`${userTasks.length} assigned`}</Badge>
                      <Badge className="bg-yellow-500  min-w-fit text-xs px-2 py-[0.2em] m-1">{`${userTasksInProgress.length} in progress`}</Badge>
                      <Badge className="bg-green-500  min-w-fit text-xs px-2 py-[0.2em] m-1 ">{`${userTasksCompleted.length} completed`}</Badge>
                    </div>
                  </div>
                  <div className="mb-4 md:w-1/4">
                    <div className="ml-auto flex flex-wrap items-center ">
                      <Label className="font-bold text-sm md:text:sm pb-4">
                        Your Teams:
                      </Label>
                    </div>
                    <div className="ml-auto flex flex-wrap items-center ">
                      <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1 bg-red-500 ">{` Admin: ${usersTeamsAsAdmin.length}`}</Badge>

                      <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1  bg-green-500 ">{` Member: ${usersTeamsAsMember.length}`}</Badge>
                    </div>
                  </div>
                  <div className="mb-4 md:w-1/4">
                    <div className="ml-auto flex flex-wrap items-center2">
                      <Label className="font-bold text-sm md:text:sm pb-4">
                        Your Projects:
                      </Label>
                    </div>
                    <div className="ml-auto flex flex-wrap items-center ">
                      <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1  bg-red-500 ">{` Admin: ${usersProjectsAsAdmin.length}`}</Badge>

                      <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1  bg-green-500">{` Member: ${usersProjectsAsMember.length}`}</Badge>
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
            className="flex mt-8 justify-center self-center w-fit   flex-col "
          >
            <TabsList className="self-center">
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>
            <TabsContent value="teams">
              <div className="z-20 flex-grow mt-2 flex w-full lg:mr-4 lg:max-w-[60vw] lg:self-center flex-col md:justify-start">
                <div className="flex  max-w-[90vw] justify-start p-2  ml-[10%] md:ml-0  my-4  align-top h-[40px] ">
                  <h1 className="text-lg md:text-xl font-bold mr-6 self-center">
                    Your Teams
                  </h1>
                  <Dialog>
                    <DialogTrigger className="h-fit flex self-center">
                      <Button
                        title="Add New Team"
                        className="rounded-full  ml-auto"
                        size="icon"
                      >
                        <PlusIcon className="w-4 h-4" />
                        <span className="sr-only">New Team Button</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[280px]">
                      <AddTeamCard />
                      {/* <DialogFooter className="sm:justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter> */}
                    </DialogContent>
                  </Dialog>
                </div>

                <div className=" flex max-w-[90vw] justify-center md:justify-start flex-row flex-wrap">
                  {usersTeamsAsAdmin &&
                    usersTeamsAsAdmin.map((team, team_idx) => {
                      return (
                        <Card
                          key={team_idx}
                          className="border  mb-4 max-w-full p-1 mr-4 md:mb-4 flex items-center w-72 h-28 bg-card shadow-lg hover:shadow-sm"
                        >
                          <Link
                            className="w-full"
                            href={`/TEAMS-CLEAN/${team.id}`}
                          >
                            {/* <Badge className=" w-full text-xs m-0 px-[0.25em] py-[0.2em] text-center bg-red-500 ">{` Admin`}</Badge> */}
                            <div className=" flex justify-end">
                              <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-red-500 ">{`Admin`}</Badge>
                            </div>

                            <CardHeader className="p-0 pl-2">
                              <CardTitle className="text-sm md:text-base">
                                {team.name}
                              </CardTitle>
                              <CardDescription className="text-xs text-ellipsis">
                                <Badge className="  min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-yellow-500 ">
                                  {`Users:  ${team.users.length}`}
                                </Badge>
                                <Badge className="  min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-sky-500 ">
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
                          className="border mb-4 max-w-full p-1 flex items-center w-72 h-28 bg-card shadow-lg hover:shadow-sm"
                        >
                          <Link
                            className="w-full"
                            href={`/TEAMS-CLEAN/${team.id}`}
                          >
                            <div className=" flex justify-end">
                              <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-green-500 ">{`Member`}</Badge>
                            </div>
                            <CardHeader className="p-0 pl-2">
                              <CardTitle className="text-sm md:text-base">
                                {team.name}
                              </CardTitle>
                              <CardDescription className="text-xs text-ellipsis">
                                <Badge className="  min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-yellow-500 ">
                                  {`Users:  ${team.users.length}`}
                                </Badge>
                                <Badge className="  min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-sky-500 ">
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
                    usersProjectsAsAdmin.map((project, project_idx) => (
                      <Card
                        key={project_idx}
                        className="border  mb-4 max-w-full p-1 mr-4 md:mb-4 flex items-center w-72 h-28 bg-card shadow-lg hover:shadow-sm"
                      >
                        <Link
                          className="w-full"
                          href={`/PROJECTS-CLEAN/${project.id}`}
                        >
                          <CardHeader className="p-0 pl-2">
                            <div className=" flex justify-end">
                              <Badge className=" min-w-fit text-xs px-1 py-[0.2em] m-1 self-end bg-red-500 ">{`Admin`}</Badge>
                            </div>

                            <CardTitle className="text-sm md:text-base">
                              {project.name}
                            </CardTitle>
                            <CardDescription className="text-xs text-ellipsis">
                              <Badge className="  min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-yellow-500 ">
                                {`Users:  ${project.users.length}`}
                              </Badge>
                              <Badge className="  min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-sky-500 ">
                                {`Tasks:  ${project.tasks.length}`}
                              </Badge>
                            </CardDescription>
                          </CardHeader>
                        </Link>
                      </Card>
                    ))}

                  {usersProjectsAsMember &&
                    usersProjectsAsMember.map((project, project_idx) => (
                      <Card
                        key={project_idx}
                        className="border  mb-4 max-w-full m-2 flex items-center w-72 h-28 bg-card hover:border-2 hover:border-slate-500 shadow-lg hover:shadow-sm"
                      >
                        <Link
                          className="w-full"
                          href={`/PROJECTS-CLEAN/${project.id}`}
                        >
                          <CardHeader className="p-0 pl-2">
                            <div className=" flex justify-end">
                              <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-green-500 ">{`Member`}</Badge>
                            </div>
                            <CardTitle className="text-sm  md:text-base">
                              {project.name}
                            </CardTitle>
                            <CardDescription className="text-xs text-ellipsis">
                              {/* <p className="truncate">{project.description}</p> */}
                              <Badge className="  min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-yellow-500 ">
                                {`Users:  ${project.users.length}`}
                              </Badge>
                              <Badge className="  min-w-fit text-xs px-2 py-[0.2em] m-1 self-end bg-sky-500 ">
                                {`Tasks:  ${project.tasks.length}`}
                              </Badge>
                            </CardDescription>
                          </CardHeader>
                        </Link>
                      </Card>
                    ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
