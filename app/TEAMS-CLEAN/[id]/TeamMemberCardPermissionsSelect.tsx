"use client";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProjectDto } from "@/use-cases/project/types";
import { UserDto } from "@/use-cases/user/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { UpdateTeamUserRoleAction } from "../_actions/update-team-user-role.action";
import { TeamDto } from "@/use-cases/team/types";
type MemberCardSearchUserBlockProps = {
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
const MemberCardPermissionsSelect = ({
  user,
  team,
}: MemberCardSearchUserBlockProps) => {
  const existingRole = getUserType(user, team.id);
  console.log("existingRole", existingRole);
  const [selectedRole, setSelectedRole] = useState(
    existingRole as "admin" | "member"
  ); // Default value is 'admin'
  console.log("selectedRole init", selectedRole);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  useEffect(() => {
    if (selectedRole !== existingRole) {
      console.log("equality", selectedRole !== existingRole);
      setShowSubmitButton(true);
    } else {
      setShowSubmitButton(false);
    }
  }, [selectedRole, existingRole]);
  const handleRoleChange = (value: string) => {
    console.log("handleRoleChange", value);
    setSelectedRole(value as "admin" | "member");
    // You can perform additional actions here if needed
  };
  const handleRoleChangeSubmit = async () => {
    console.log("handleRoleChangeSubmit", selectedRole);
    console.log("user", user);
    console.log("team", team);
    console.log("selectedRole", selectedRole);
    // You can perform additional actions here if needed
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

export default MemberCardPermissionsSelect;
