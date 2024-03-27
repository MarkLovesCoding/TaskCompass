/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/HerIHKPDoM4
 */
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import Link from "next/link";

import { MailIcon, KeyIcon, CheckIcon, ClockIcon } from "lucide-react";
import { ProjectDto } from "@/use-cases/project/types";
import { UserDto } from "@/use-cases/user/types";
import { getInitials } from "@/lib/utils/getInitials";
import { TaskDto } from "@/use-cases/task/types";
import MemberCardPermissionsSelect from "./MemberCardPermissionsSelect";
import { TeamDto } from "@/use-cases/team/types";
type MemberCardWithPermissionsProps = {
  user: UserDto;
  project: ProjectDto;
  tasks: TaskDto[];
  team: TeamDto;
};
export function MemberCardWithPermissions({
  user,
  project,
  tasks,
  team,
}: MemberCardWithPermissionsProps) {
  console.log("taskss: ", tasks);
  const usersTasks = tasks.filter((task) => task.assignees.includes(user.id));
  console.log("usersTasks", usersTasks);
  console.log("user", user);
  const tasksCompleted = usersTasks.filter(
    (task) => task.status == "Completed"
  ).length;
  const tasksActive = usersTasks.filter(
    (task) => task.status !== "Completed"
  ).length;

  return (
    <Card className="max-w-[95vw] mx-auto  border-2 border-nav-background  ">
      <CardHeader className="pb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              {/* <AvatarImage alt={user.name} src="@/public/default-avatar.jpg" /> */}
              <AvatarFallback className="bg-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="text-lg font-bold">{user.name}</div>
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
          <div className="text-right">
            {project.createdBy !== user.id ? (
              <MemberCardPermissionsSelect user={user} project={project} />
            ) : (
              <Badge className="shrink-0" variant="secondary">
                Admin
              </Badge>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 smallWidth:gap-2">
          <div className="flex items-center space-x-2 smallWidth:space-x-1">
            <CheckIcon className="w-4 h-4 opacity-60" />
            <span className="text-sm smallWidth:text-xs font-medium">
              Tasks Completed
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm  smallWidth:text-xs font-medium">
              {tasksCompleted}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 smallWidth:gap-">
          <div className="flex items-center space-x-2 smallWidth:space-x-1">
            <ClockIcon className="w-4 h-4 opacity-60" />
            <span className="text-sm smallWidth:text-xs font-medium">
              Active Tasks
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm smallWidth:text-xs  font-medium">
              {tasksActive}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
