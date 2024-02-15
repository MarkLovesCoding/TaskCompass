import Link from "next/link";

import { getTeamProjects } from "@/data-access/projects/get-team-projects";
import AddProjectCard from "./AddProjectCard";

import { Button } from "@/components/ui/button";
import { TeamHeader } from "@/components/component/team-header";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import type { TeamDto } from "@/use-cases/team/types";
import { CircleEllipsisIcon } from "lucide-react";
import UpdateTeamMembersCard from "./UpdateTeamMembersCard";
import getAllUsers from "@/data-access/users/get-all-users.persistence";
import getTeamMembers from "@/data-access/users/get-team-members.persistence";
export async function TeamPageComponent({ team }: { team: TeamDto }) {
  const projects = await getTeamProjects(team);
  const usersList = await getAllUsers();
  const filteredUsers = usersList.filter(
    (user) => !team.members.includes(user.id)
  );
  const teamMembers = await getTeamMembers(team.members);
  console.log("team", team);
  const teamId = team.id;
  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="flex flex-row p-10 justify-center align-middle">
          <div className="text-2xl font-bold mr-10">
            <TeamHeader team={team} />
            {team.members}
          </div>
          <Dialog>
            <DialogTrigger>
              {/* <HoverCard> */}
              {/* <HoverCardTrigger> */}
              <Button className="rounded-full ml-auto" size="icon">
                <PlusIcon className="w-4 h-4" />
                <span className="sr-only">New Project Button</span>
              </Button>
              {/* </HoverCardTrigger> */}
              {/* <HoverCardContent
                  side="right"
                  //@ts-expect-error //bug in radix code
                  sideOffset="2"
                  className="max-w-fit"
                >
                  Add New Project
                </HoverCardContent>
              </HoverCard> */}
            </DialogTrigger>
            <DialogContent className="max-w-[300px]">
              <AddProjectCard teamId={teamId} />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger>
              {/* <HoverCard> */}
              {/* <HoverCardTrigger> */}
              <Button className="rounded-full ml-auto" size="icon">
                <CircleEllipsisIcon className="w-4 h-4" />
                <span className="sr-only">Team Settings</span>
              </Button>
              {/* </HoverCardTrigger> */}
              {/* <HoverCardContent
                  side="right"
                  //@ts-expect-error //bug in radix code
                  sideOffset="2"
                  className="max-w-fit"
                >
                  Add New Project
                </HoverCardContent>
              </HoverCard> */}
            </DialogTrigger>
            <DialogContent className="max-w-[300px]">
              <UpdateTeamMembersCard
                team={team}
                filteredUsers={filteredUsers}
                teamMembers={teamMembers}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {projects &&
            projects.map((project, project_idx) => (
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
