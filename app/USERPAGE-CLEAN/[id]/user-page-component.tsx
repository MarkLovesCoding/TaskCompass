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
      <main className="flex bg-background items-center overflow-x-hidden flex-col p-4 md:gap-8 md:p-10">
        <div className="w-full h-[15vh] bg-primary-foreground absolute top-0 left-0 "></div>
        <div className="z-20   max-w-[90vw] w-[280px] md:w-[80%] md:max-w-[650px] flex flex-col items-center self-center border-solid p-4 bg-secondary border border-secondary-foreground space-y-4 rounded-md  ">
          {/* <div className="bg-gray-100 p-4 rounded-lg shadow-md"> */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="summary">
              <AccordionTrigger>
                <div className="flex items-center space-x-3 my-2">
                  <Avatar className="w-10 h-10 bg-background">
                    {/* <AvatarImage alt={user.name} src="@/public/default-avatar.jpg" /> */}
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <p className="text-lg font-bold">Hey {user.name}!</p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col mt-4 pb-4 md:flex-row md:flex-wrap md:justify-between md:space-x-4  bg-transparent">
                  {/* <div className="mb-4 md:w-1/4"> */}

                  {/* </div> */}
                  <div className="mb-4 md:w-1/4">
                    <div className="ml-auto flex flex-wrap items-center ">
                      <Label className="font-bold text-sm md:text:sm pb-4">
                        Tasks:
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
                        Teams:
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
                        Projects:
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

          {/* </div> */}

          {/* <div className="flex flex-row space-x-4 ">
            <p className="text-lg font-bold">Hey {user.name}!</p>
            <p className="text-xs ">
              {"Here's a summary of your teams and projects."}
            </p>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row space-x-4">
              <Label>
                <span className="text-sm ">Teams As Admin: </span>
                <span className="text-sm font-bold">
                  {usersTeamsAsAdmin.length}
                </span>
              </Label>
              <Label>
                <span className="text-sm">Teams As Member: </span>
                <span className="text-sm font-bold">
                  {usersTeamsAsMember.length}
                </span>
              </Label>
            </div>
            <div className="flex flex-row space-x-4 ">
              <Label>
                <span className="text-sm ">Projects As Admin: </span>
                <span className="text-sm font-bold">
                  {usersProjectsAsAdmin.length}
                </span>
              </Label>
              <Label>
                <span className="text-sm ">Projects As Member: </span>
                <span className="text-sm font-bold">
                  {usersProjectsAsMember.length}
                </span>
              </Label>
              <Label>
                <span className="text-sm ">Assigned Tasks: </span>
                <span className="text-sm font-bold">{user.tasks.length}</span>
              </Label>
            </div>
          </div> */}
        </div>

        <div className="flex flex-col w-[650px] md:max-w-[650px] justify-between md:flex-row  ">
          <div className="z-20 mt-16 md:mt-0 min-h-[240px] max-w-[280px] w-[280px] md:w-[280px] self-center  flex flex-col items-center border-solid p-4 bg-secondary border border-secondary-foreground space-y-4 rounded-md   ">
            <div className="flex  p-2 justify-start align-top h-fit ">
              <h1 className="text-lg md:text-xl font-bold mr-6 self-center">
                Your Teams
              </h1>
              <Dialog>
                <DialogTrigger>
                  <Button
                    title="Add New Team"
                    className="rounded-full ml-auto"
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
            <ScrollArea className=" w-fit h-fit flex-grow">
              <ScrollBar
                orientation="horizontal"
                className="w-full "
              ></ScrollBar>
              <div className=" flex flex-row md:justify-center md:flex-col">
                {usersTeamsAsAdmin &&
                  usersTeamsAsAdmin.map((team, team_idx) => {
                    return (
                      <Card
                        key={team_idx}
                        className="border rounded-md mb-4 max-w-full p-1 flex items-center w-56 h-28 border-gray-500  bg-gray-800 shadow-lg hover:shadow-sm"
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
                              <p>Projects: {team.projects.length}</p>
                              <p>Users: {team.users.length}</p>
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
                        className="border rounded-md mb-4 max-w-full p-1 flex items-center w-56 h-28 border-gray-500  bg-gray-800 shadow-lg hover:shadow-sm"
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
                              <p>Projects: {team.projects.length}</p>
                              <p>Users: {team.users.length}</p>
                            </CardDescription>
                          </CardHeader>
                        </Link>
                      </Card>
                    );
                  })}
              </div>
            </ScrollArea>
          </div>

          <Separator className="my-10 w-[75%] max-w-[320px]  self-center md:hidden" />
          <div className="z-20    min-h-[240px] max-w-[280px]  w-[280px] self-center  flex flex-col items-center border-solid p-4 bg-secondary border border-secondary-foreground space-y-4 rounded-md md:w-[300px]  ">
            <div className="flex  p-2 justify-start align-top h-fit ">
              <h1 className="text-lg md:text-xl font-bold mr-6 self-center">
                Your Projects
              </h1>
            </div>
            <ScrollArea className=" w-fit h-fit flex-grow">
              <ScrollBar
                orientation="horizontal"
                className="w-full"
              ></ScrollBar>
              <div className=" flex flex-row md:justify-center md:flex-col">
                {usersProjectsAsAdmin &&
                  usersProjectsAsAdmin.map((project, project_idx) => (
                    <Card
                      key={project_idx}
                      className="border rounded-md mb-4 max-w-full p-1 flex items-center w-56 h-28 border-gray-500  bg-gray-800 shadow-lg hover:shadow-sm"
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
                            <p>Tasks: {project.tasks.length}</p>
                            <p>Users: {project.users.length}</p>
                          </CardDescription>
                        </CardHeader>
                      </Link>
                    </Card>
                  ))}

                {usersProjectsAsMember &&
                  usersProjectsAsMember.map((project, project_idx) => (
                    <Card
                      key={project_idx}
                      className="border rounded-md mb-4 max-w-full p-2 flex items-center  w-56 h-28  border-gray-500  bg-gray-800 shadow-lg hover:shadow-sm"
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
                            <p>Tasks: {project.tasks.length}</p>
                            <p>Users: {project.users.length}</p>
                          </CardDescription>
                        </CardHeader>
                      </Link>
                    </Card>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </main>
    </div>
  );
}
