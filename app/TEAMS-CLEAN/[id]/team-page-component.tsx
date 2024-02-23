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
import { Archive, CircleEllipsisIcon } from "lucide-react";
import { PlusIcon } from "lucide-react";
import UpdateTeamMembersCard from "./UpdateTeamMembersCard";
import { Separator } from "@/components/ui/separator";

import { unstable_noStore } from "next/cache";
import UnarchiveProjectPopover from "./UnarchiveProjectPopover";
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
import { ScrollArea } from "@/components/ui/scroll-area";

import { ProjectDto } from "@/use-cases/project/types";
import { UserDto } from "@/use-cases/user/types";
import { useEffect } from "react";
export async function TeamPageComponent({
  team,
  userId,
  projects,
  usersList,
  teamMembers,
  teamAdmins,
}: {
  team: TeamDto;
  userId: string;
  projects: ProjectDto[];
  usersList: UserDto[];
  teamMembers: UserDto[];
  teamAdmins: UserDto[];
}) {
  unstable_noStore();
  // const projects = await getTeamProjects(team);
  // const usersList = await getAllUsers();
  // const filteredUsers = usersList.filter(
  //   (user) => !team.members.includes(user.id)
  // );
  // const teamMembers = await getTeamMembers(team.members);
  console.log("team", team);
  const teamId = team.id;
  const archivedProjects = projects.filter((project) => project.archived);
  const isUserAdmin = teamAdmins.some((admin) => admin.id === userId);

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
          {isUserAdmin && (
            <div className="flex flex-row">
              <Dialog>
                <DialogTrigger>
                  <PlusIcon className="w-4 h-4" />
                  <span className="sr-only">New Project Button</span>
                </DialogTrigger>
                <DialogContent className="max-w-[300px]">
                  <AddProjectCard teamId={teamId} />
                </DialogContent>
              </Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <CircleEllipsisIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Add users</DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <UpdateTeamMembersCard
                            userId={userId}
                            team={team}
                            globalUsers={usersList}
                            teamMembers={teamMembers}
                          />
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        Archived Projects
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <ScrollArea>
                            {archivedProjects.length === 0 ? (
                              <div className="p-4">No archived projects</div>
                            ) : (
                              <div className="p-4 flex flex-col">
                                {
                                  // projects.length === 0
                                  //   ? "No archived projects"
                                  //   :
                                  projects.map(
                                    (project, project_idx) =>
                                      project.archived && (
                                        <div key={project_idx}>
                                          <UnarchiveProjectPopover
                                            project={project}
                                          />

                                          {project_idx !== 0 ||
                                            (project_idx !==
                                              archivedProjects.length - 1 && (
                                              <Separator className="my-2" />
                                            ))}
                                        </div>
                                      )
                                  )
                                }
                              </div>
                            )}
                          </ScrollArea>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {projects &&
            projects.map((project, project_idx) => (
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
      </main>
    </div>
  );
}
