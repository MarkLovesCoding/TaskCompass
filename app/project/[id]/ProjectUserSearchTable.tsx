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

export function MemberCardSearchTable({
  userId,
  project,
  teamUsers,
  projectUsers,
}: {
  userId: string;
  project: ProjectDto;
  teamUsers: UserDto[];
  projectUsers: UserDto[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <Button
            variant="outline"
            className=" text-xs    py-1 m-1 h-8  hover:bg-primary bg-secondary"
          >
            <UserSearchIcon className="w-10 h-10 cursor-pointer hover:bg-primary p-2 rounded-full" />
          </Button>
          <span className="sr-only">Edit Project Users</span>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] mx-2 w-fit  ">
        <ProjectUserTableCommand
          userId={userId}
          project={project}
          teamUsers={teamUsers}
          projectUsers={projectUsers}
        />
      </DialogContent>
    </Dialog>
  );
}
