"use client";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select-user-permissions";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserDto } from "@/use-cases/user/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { UpdateTeamUserRoleAction } from "../_actions/update-team-user-role.action";
import { TeamDto } from "@/use-cases/team/types";
type TeamUserBlockProps = {
  user: UserDto;
  team: TeamDto;
};
const getUserType = (user: UserDto, projectId: string) => {
  if (user.teamsAsAdmin.includes(projectId)) {
    return "admin";
  } else {
    return "member";
  }
};
const TeamUserPermissionsSelect = ({ user, team }: TeamUserBlockProps) => {
  const existingRole = getUserType(user, team.id);
  const [selectedRole, setSelectedRole] = useState(
    existingRole as "admin" | "member"
  ); // Default value is 'admin'
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  useEffect(() => {
    if (selectedRole !== existingRole) {
      setShowSubmitButton(true);
    } else {
      setShowSubmitButton(false);
    }
  }, [selectedRole, existingRole]);
  const handleRoleChange = (value: string) => {
    setSelectedRole(value as "admin" | "member");
  };
  const handleRoleChangeSubmit = async () => {
    await UpdateTeamUserRoleAction(
      user.id,
      team.id,
      selectedRole as "admin" | "member"
    );
    // updateProjectUserRoleAction(user, project, selectedRole);
    toast.success(`User role updated to ${selectedRole}`);
    setShowSubmitButton(false);
    router.refresh();
  };

  const router = useRouter();

  // Function to handle the change in user type
  return (
    <>
      <Select
        onValueChange={(value) => handleRoleChange(value)}
        defaultValue={getUserType(user, team.id)}
      >
        <SelectTrigger>
          <SelectValue placeholder={getUserType(user, team.id)} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="member">Member</SelectItem>
        </SelectContent>
      </Select>
      {showSubmitButton && (
        <Button
          type="submit"
          className="ml-4 p-2 md:px-4 h-8 text-xs self-center bg-primary hover:bg-badgeGreen md:text-sm"
          onClick={(e) => {
            e.preventDefault();

            handleRoleChangeSubmit();
          }}
          disabled={!showSubmitButton}
        >
          Save
        </Button>
      )}
    </>
  );
};

export default TeamUserPermissionsSelect;
