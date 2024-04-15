"use client";
import { Button } from "@/components/ui/button";

import { UserSearchIcon } from "lucide-react";
import { ProjectDto } from "@/use-cases/project/types";
import { UserDto } from "@/use-cases/user/types";

import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog-user-search";
import { ProjectUserTableCommand } from "./ProjectUserTableCommand";

export function ProjectUserSearchTable({
  userId,
  project,
  teamUsers,
  projectUsers,
  isCurrentUserAdmin,
}: {
  userId: string;
  project: ProjectDto;
  teamUsers: UserDto[];
  projectUsers: UserDto[];
  isCurrentUserAdmin: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <Button
            variant="outline"
            className=" text-xs    py-1 m-1 h-8  hover:bg-primary bg-secondary"
          >
            <UserSearchIcon className="w-8 h-8 lg:w-10 lg:h-10 cursor-pointer  p-2 " />
          </Button>
          <span className="sr-only">Show / Edit Project Users</span>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] mx-2 w-fit  ">
        <ProjectUserTableCommand
          userId={userId}
          project={project}
          teamUsers={teamUsers}
          projectUsers={projectUsers}
          isCurrentUserAdmin={isCurrentUserAdmin}
        />
      </DialogContent>
    </Dialog>
  );
}
