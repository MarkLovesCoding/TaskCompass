import Link from "next/link";
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
import type { UserDto } from "@/use-cases/user/types";
import AddTeamCard from "./AddTeamCard";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ProjectDto } from "@/use-cases/project/types";
import { TeamDto } from "@/use-cases/team/types";
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
                  <Card key={team_idx}>
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
                  <Card key={team_idx}>
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
                <Card key={project_idx}>
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
                <Card key={project_idx}>
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

//@ts-expect-error
function LayoutIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" x2="21" y1="9" y2="9" />
      <line x1="9" x2="9" y1="21" y2="9" />
    </svg>
  );
}

//@ts-expect-error

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
