import { AvatarFallback, Avatar } from "@/components/ui/avatar-card";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import Link from "next/link";

import { MailIcon, KeyIcon } from "lucide-react";
import { UserDto } from "@/use-cases/user/types";
import { getInitials } from "@/lib/utils/getInitials";
import TeamUserCardPermissionsSelect from "./TeamUserCardPermissionsSelect";
import { TeamDto } from "@/use-cases/team/types";
type TeamUserCardWithPermissionsProps = {
  user: UserDto;
  team: TeamDto;
  isCurrentUserAdmin: boolean;
};
export function TeamUserCardWithPermissions({
  user,
  team,
  isCurrentUserAdmin,
}: TeamUserCardWithPermissionsProps) {
  const getUserPrivilegesLevel = (user: UserDto, team: TeamDto) => {
    const doesUserHaveAdminPrivileges = user.teamsAsAdmin.some(
      (teamAsAdmin) => teamAsAdmin === team.id
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
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="text-lg font-bold">{user.name}</div>
          </div>
          <div className="ml-auto flex items-center space-x-2"></div>
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
          <div className="text-right space-x-4 flex flex-row">
            {team.createdBy !== user.id && isCurrentUserAdmin ? (
              <TeamUserCardPermissionsSelect user={user} team={team} />
            ) : (
              <Badge
                className={`min-w-fit text-xs px-2 py-[0.2em] m-1 ${
                  getUserPrivilegesLevel(user, team)
                    ? "bg-badgeRed"
                    : "bg-badgeBlue"
                } `}
              >
                {getUserPrivilegesLevel(user, team) ? `Admin` : `Member`}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
