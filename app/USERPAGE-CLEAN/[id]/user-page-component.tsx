import Link from "next/link";

import AddTeamCard from "./AddTeamCard";

import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
} from "@/components/ui/card";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
      <main className="flex bg-background overflow-x-hidden flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="w-full h-[30vh] bg-primary-foreground absolute top-0 left-0 z-10"></div>
        <div className="z-20   p-4 ">
          {/* <div className="bg-gray-100 p-4 rounded-lg shadow-md"> */}
          <Accordion type="single" collapsible>
            <AccordionItem value="summary">
              <AccordionTrigger>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    {/* <AvatarImage alt={user.name} src="@/public/default-avatar.jpg" /> */}
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <p className="text-lg font-bold">Hey {user.name}!</p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between md:space-x-4  bg-transparent">
                  {/* <div className="mb-4 md:w-1/4"> */}

                  {/* </div> */}
                  <div className="mb-4 md:w-1/4">
                    <div className="ml-auto flex flex-wrap items-center space-x-2">
                      <Label className="font-bold text-sm md:text:sm">
                        Tasks:
                      </Label>

                      <Badge className="bg-gray-500  min-w-fit text-xs px-2 py-[0.2em] m-1">{`${userTasks.length} assigned`}</Badge>
                      <Badge className="bg-yellow-500  min-w-fit text-xs px-2 py-[0.2em] m-1">{`${userTasksInProgress.length} in progress`}</Badge>
                      <Badge className="bg-green-500  min-w-fit text-xs px-2 py-[0.2em] m-1 ">{`${userTasksCompleted.length} completed`}</Badge>
                    </div>
                  </div>
                  <div className="mb-4 md:w-1/4">
                    <div className="ml-auto flex flex-wrap items-center space-x-2">
                      <Label className="font-bold text-sm md:text:sm">
                        Teams:
                      </Label>

                      <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1 bg-red-500 ">{` Admin: ${usersTeamsAsAdmin.length}`}</Badge>

                      <Badge className=" min-w-fit text-xs px-2 py-[0.2em] m-1  bg-green-500 ">{` Member: ${usersTeamsAsMember.length}`}</Badge>
                    </div>
                  </div>
                  <div className="mb-4 md:w-1/4">
                    <div className="ml-auto flex flex-wrap items-center space-x-2">
                      <Label className="font-bold text-sm md:text:sm">
                        Projects:
                      </Label>

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

        <div className="flex flex-col md:flex-row max-w-[100vw] justify-evenly">
          <div className="z-20  border-solid p-4 space-y-4 rounded-md md:w-[300px]  ">
            <div className="flex flex-row p-2 justify-start align-middle h-fit ">
              <h1 className="text-lg md:text-xl font-bold mr-6 self-center">
                Your Teams
              </h1>
              <Dialog>
                <DialogTrigger>
                  <HoverCard>
                    <HoverCardTrigger>
                      <Button className="rounded-full ml-auto" size="icon">
                        <PlusIcon className="w-4 h-4" />
                        <span className="sr-only">New Team Button</span>
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                      side="right"
                      //@ts-expect-error //bug in radix code
                      sideOffset="2"
                      className="max-w-fit"
                    >
                      Add New Team
                    </HoverCardContent>
                  </HoverCard>
                </DialogTrigger>
                <DialogContent className="max-w-[300px]">
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
            <ScrollArea className=" h-[125px] flex flex-row md:justify-center align-middle md:flex-col space-x-4 md:space-y-4 md:space-x-0">
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
                        className="border rounded-md flex items-center w-48 h-24 md:72 border-gray-500 bg-gray-800 shadow-lg hover:shadow-sm"
                      >
                        <Link href={`/TEAMS-CLEAN/${team.id}`}>
                          <Badge className=" min-w-fit text-xs px-1 py-[0.2em] m-1 bg-red-500 ">{` Admin`}</Badge>
                          <CardHeader>
                            <CardTitle className="text-md md:text-lg">
                              {team.name}
                            </CardTitle>
                            <CardDescription>
                              <p>Users: {team.users.length}</p>
                            </CardDescription>{" "}
                          </CardHeader>
                        </Link>
                      </Card>
                    );
                  })}
              </div>{" "}
              <div className="flex flex-row md:justify-center md:flex-col">
                {usersTeamsAsMember &&
                  usersTeamsAsMember.map((team, team_idx) => {
                    return (
                      <Card
                        key={team_idx}
                        className="border rounded-lg flex items-center w-72 border-gray-500 bg-gray-800 shadow-lg hover:shadow-sm"
                      >
                        <Link href={`/TEAMS-CLEAN/${team.id}`}>
                          <CardHeader>
                            <CardTitle className="text-md md:text-lg">
                              {team.name}
                            </CardTitle>
                            <CardDescription>
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

          <Separator className="my-10 md:hidden" />
          <div className="z-20  border-solid border-slate-100 bg-slate-700 p-4 rounded-md md:w-[300px]  ">
            <div className="flex flex-row p-2 justify-start align-middle">
              <h1 className="text-lg md:text-xl  font-bold mr-6 self-center">
                Your Projects
              </h1>
            </div>
            <ScrollArea className="w-fit h-fit">
              <ScrollBar
                orientation="horizontal"
                className="w-full"
              ></ScrollBar>
              <div className="flex flex-row md:justify-center md:flex-col space-x-4 md:space-y-4 md:space-x-0">
                {usersProjectsAsAdmin &&
                  usersProjectsAsAdmin.map((project, project_idx) => (
                    <Card
                      key={project_idx}
                      className="border rounded-lg flex items-center w-72 border-gray-500 bg-gray-800 shadow-lg hover:shadow-sm"
                    >
                      <Link href={`/PROJECTS-CLEAN/${project.id}`}>
                        <CardHeader>
                          <CardTitle className="text-md md:text-lg">
                            {project.name}
                          </CardTitle>
                          <CardDescription>
                            {project.description}
                            <p>members: {project.users.length}</p>
                          </CardDescription>
                        </CardHeader>
                      </Link>
                    </Card>
                  ))}
              </div>{" "}
              <div className="flex flex-row md:justify-center md:flex-col space-x-4 md:space-y-4 md:space-x-0">
                {usersProjectsAsMember &&
                  usersProjectsAsMember.map((project, project_idx) => (
                    <Card
                      key={project_idx}
                      className="border rounded-lg flex items-center w-72 border-gray-500 bg-gray-800 shadow-lg hover:shadow-sm"
                    >
                      <Link href={`/PROJECTS-CLEAN/${project.id}`}>
                        <CardHeader>
                          <CardTitle className="text-md md:text-lg">
                            {project.name}
                          </CardTitle>
                          <CardDescription>
                            {project.description}
                            <p>members: {project.users.length}</p>
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
