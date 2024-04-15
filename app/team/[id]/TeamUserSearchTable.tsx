"use client";
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "@/components/ui/popover";
import { Search, UserSearchIcon } from "lucide-react";
import { ProjectDto } from "@/use-cases/project/types";
import { UserDto } from "@/use-cases/user/types";
// import { updateProjectAdminsAction } from "@/app/PROJECTS-CLEAN/_actions/update-project-admins.action";
import { TeamUserTableCommand } from "./TeamUserTableCommand";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog-user-search";
import { TeamDto } from "@/use-cases/team/types";

export function TeamUserSearchTable({
  userId,
  userData,
  team,
  teamUsers,
  globalUsers,
  projects,
  isCurrentUserAdmin,
}: {
  userId: string;
  userData: UserDto;
  team: TeamDto;
  teamUsers: UserDto[];
  globalUsers: UserDto[];
  projects: ProjectDto[];
  isCurrentUserAdmin: boolean;
}) {
  //default useEffect to update teamUsersLists and Permissions on render., dependant on users data
  //check on mongodb if permissions updates right away on save.
  // might be better to filter global users in api ...

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <UserSearchIcon className="w-10 h-10 cursor-pointer hover:bg-primary p-2 rounded-full" />
          <span className="sr-only">Show/Edit Team Users</span>
        </div>
      </DialogTrigger>
      <DialogContent className=" max-w-[95vw] mx-2 w-fit ">
        <TeamUserTableCommand
          userId={userId}
          userData={userData}
          team={team}
          teamUsers={teamUsers}
          globalUsers={globalUsers}
          projects={projects}
          isCurrentUserAdmin={isCurrentUserAdmin}
        />
      </DialogContent>
    </Dialog>
  );
}
