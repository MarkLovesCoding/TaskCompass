import Link from "next/link";

import { getTeamProjects } from "@/data-access/projects/get-team-projects";
import AddProjectCard from "./AddProjectCard";

import { TeamHeader } from "@/app/TEAMS-CLEAN/[id]/team-header";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import type { TeamDto } from "@/use-cases/team/types";
import { CircleEllipsisIcon } from "lucide-react";
import { PlusIcon } from "lucide-react";
import UpdateTeamMembersCard from "./UpdateTeamMembersCard";
import getAllUsers from "@/data-access/users/get-all-users.persistence";
import getTeamMembers from "@/data-access/users/get-team-members.persistence";
import { unstable_noStore } from "next/cache";
export async function TeamPageComponent({
  team,
  userId,
}: {
  team: TeamDto;
  userId: string;
}) {
  unstable_noStore();
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
            {teamMembers.map((member, index) => (
              <div key={index}>{member.name}</div>
            ))}
          </div>
          <Dialog>
            <DialogTrigger>
              <PlusIcon className="w-4 h-4" />
              <span className="sr-only">New Project Button</span>
            </DialogTrigger>
            <DialogContent className="max-w-[300px]">
              <AddProjectCard teamId={teamId} />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger>
              <CircleEllipsisIcon className="w-4 h-4" />
              <span className="sr-only">Team Settings</span>
            </DialogTrigger>
            <DialogContent className="max-w-[300px]">
              <UpdateTeamMembersCard
                userId={userId}
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
