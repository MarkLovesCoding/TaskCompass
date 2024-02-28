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

// get teams
// get projects
export async function UserPageComponent({
  user,
  usersTeamsAsMember,
  usersTeamsAsAdmin,
  usersProjectsAsMember,
  usersProjectsAsAdmin,
}: {
  user: UserDto;
  usersTeamsAsMember: TeamDto[];
  usersTeamsAsAdmin: TeamDto[];
  usersProjectsAsMember: ProjectDto[];
  usersProjectsAsAdmin: ProjectDto[];
}) {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div>
          <h1 className="text-lg font-bold">Hey {user.name}!</h1>
          <p className="text-sm ">
            {"Here's a summary of your teams and projects."}
          </p>
        </div>

        <div>
          <div className="flex flex-row p-10 justify-center align-middle">
            <h1 className="text-2xl font-bold mr-10">Your Teams</h1>
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
          <div className="grid gap-4 md:grid-cols-3">
            {usersTeamsAsAdmin &&
              usersTeamsAsAdmin.map((team, team_idx) => {
                return (
                  <Card
                    key={team_idx}
                    className="border rounded-lg flex items-center w-72 border-gray-500 bg-gray-800 shadow-lg hover:shadow-sm"
                  >
                    <Link href={`/TEAMS-CLEAN/${team.id}`}>
                      <CardHeader>
                        <CardTitle>{team.name}</CardTitle>
                        {/* <CardDescription>{team.description}</CardDescription> */}
                      </CardHeader>
                    </Link>
                  </Card>
                );
              })}
          </div>{" "}
          <div className="grid gap-4 md:grid-cols-3">
            {usersTeamsAsMember &&
              usersTeamsAsMember.map((team, team_idx) => {
                return (
                  <Card
                    key={team_idx}
                    className="border rounded-lg flex items-center w-72 border-gray-500 bg-gray-800 shadow-lg hover:shadow-sm"
                  >
                    <Link href={`/TEAMS-CLEAN/${team.id}`}>
                      <CardHeader>
                        <CardTitle>{team.name}</CardTitle>
                        {/* <CardDescription>{team.description}</CardDescription> */}
                      </CardHeader>
                    </Link>
                  </Card>
                );
              })}
          </div>
        </div>

        <div>
          <Separator className="my-10" />
          <div className="flex flex-row p-10 justify-center align-middle">
            <h1 className="text-2xl font-bold mr-10">Your Projects</h1>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {usersProjectsAsAdmin &&
              usersProjectsAsAdmin.map((project, project_idx) => (
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
              ))}
          </div>{" "}
          <div className="grid gap-4 md:grid-cols-3">
            {usersProjectsAsMember &&
              usersProjectsAsMember.map((project, project_idx) => (
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
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
