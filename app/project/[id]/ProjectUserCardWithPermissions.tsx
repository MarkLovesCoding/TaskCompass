import Link from "next/link";

import {
  AvatarImage,
  AvatarFallback,
  Avatar,
} from "@/components/ui/avatar-card";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardContent, Card } from "@/components/ui/card-user";
import { MailIcon, KeyIcon, CheckIcon, ClockIcon } from "lucide-react";

import { getInitials } from "@/lib/utils/getInitials";
import ProjectUserPermissionsSelect from "./ProjectUserPermissionsSelect";

import type { ProjectDto } from "@/use-cases/project/types";
import type { UserDto } from "@/use-cases/user/types";
import type { TaskDto } from "@/use-cases/task/types";
import type { TeamDto } from "@/use-cases/team/types";

type ProjectUserCardWithPermissionsProps = {
  user: UserDto;
  project: ProjectDto;
  tasks: TaskDto[];
  team: TeamDto;
  isCurrentUserAdmin: boolean;
};
export function ProjectUserCardWithPermissions({
  user,
  project,
  tasks,
  team,
  isCurrentUserAdmin,
}: ProjectUserCardWithPermissionsProps) {
  const usersTasks = tasks.filter((task) => task.assignees.includes(user.id));
  const tasksCompleted = usersTasks.filter(
    (task) => task.status == "Completed"
  ).length;
  const tasksActive = usersTasks.filter(
    (task) => task.status !== "Completed"
  ).length;
  const getUserPrivilegesLevel = (user: UserDto, project: ProjectDto) => {
    const doesUserHaveAdminPrivileges = user.projectsAsAdmin.some(
      (projectAsAdmin) => projectAsAdmin === project.id
    );
    return doesUserHaveAdminPrivileges;
  };
  return (
    <Card className="max-w-[95vw] mx-auto  border-2 border-nav-background  ">
      <CardHeader className="pb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8 md:w-10 md:h-10 bg-primary">
              {/* <AvatarImage alt={user.name} src="@/public/default-avatar.jpg" /> */}
              <AvatarFallback className="bg-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-base md:text-lg font-bold">{user.name}</div>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <Badge variant="outline">{`${usersTasks.length} task${
              usersTasks.length != 1 ? "s" : ""
            }`}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4 smallWidth:space-y-2">
        <div className="grid grid-cols-2 gap-4 smallWidth:gap-2">
          <div className="flex items-center space-x-2 smallWidth:space-x-1">
            <MailIcon className="w-4 h-4 opacity-60" />
            <span className="text-sm font-medium smallWidth:text-xs   ">
              Email
            </span>
          </div>
          <div className="text-right  truncate">
            <Link
              title={user.email}
              className="text-xs smallWidth:text-xs font-light text-right underline"
              href="#"
            >
              {user.email}
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 smallWidth:gap-2">
          <div className="flex items-center space-x-2 smallWidth:space-x-1">
            <KeyIcon className="w-4 h-4 opacity-60" />
            <span className="text-sm smallWidth:text-xs font-medium">Role</span>
          </div>
          <div className="text-right flex flex-row">
            {project.createdBy !== user.id && isCurrentUserAdmin ? (
              <ProjectUserPermissionsSelect user={user} project={project} />
            ) : (
              <Badge
                className={`min-w-fit text-xs px-2 py-[0.2em] m-1 ${
                  project.createdBy == user.id
                    ? "bg-badgePurple"
                    : getUserPrivilegesLevel(user, project)
                    ? "bg-badgeRed"
                    : "bg-badgeBlue"
                } `}
              >
                {project.createdBy == user.id
                  ? "Creator"
                  : getUserPrivilegesLevel(user, project)
                  ? `Admin`
                  : `Member`}
              </Badge>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 smallWidth:gap-2">
          <div className="flex items-center space-x-2 smallWidth:space-x-1">
            <CheckIcon className="w-4 h-4 opacity-60" />
            <span className="text-sm smallWidth:text-xs font-base">
              Tasks Completed
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm  smallWidth:text-xs font-base">
              {tasksCompleted}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 smallWidth:gap-">
          <div className="flex items-center space-x-2 smallWidth:space-x-1">
            <ClockIcon className="w-4 h-4 opacity-60" />
            <span className="text-sm smallWidth:text-xs font-base">
              Active Tasks
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm smallWidth:text-xs  font-base">
              {tasksActive}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
