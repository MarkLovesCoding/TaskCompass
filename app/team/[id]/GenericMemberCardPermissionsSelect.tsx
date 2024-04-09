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
import { ProjectDto } from "@/use-cases/project/types";
import { UpdateProjectUserRoleAction } from "@/app/project/_actions/update-project-user-role.action";
type ObjectType = TeamDto | ProjectDto;
type MemberCardSearchUserBlockProps = {
  user: UserDto;
  object: ObjectType;
  cardType: "team" | "project";
};
const getUserType = (
  user: UserDto,
  id: string,
  cardType: "team" | "project"
) => {
  if ((cardType = "project")) {
    if (user.projectsAsAdmin.includes(id)) {
      return "admin";
    } else {
      return "member";
    }
  } else {
    if (user.teamsAsAdmin.includes(id)) {
      return "admin";
    } else {
      return "member";
    }
  }
};
const GenericMemberCardPermissionsSelect = ({
  user,
  object,
  cardType,
}: MemberCardSearchUserBlockProps) => {
  const existingRole = getUserType(user, object.id, cardType);
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
    if (cardType === "team") {
      await UpdateTeamUserRoleAction(
        user.id,
        object.id,
        selectedRole as "admin" | "member"
      );
    } else {
      await UpdateProjectUserRoleAction(
        user.id,
        object.id,
        selectedRole as "admin" | "member"
      );
    }
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
        defaultValue={getUserType(user, object.id, cardType)}
      >
        <SelectTrigger>
          <SelectValue placeholder={getUserType(user, object.id, cardType)} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="member">Member</SelectItem>
        </SelectContent>
      </Select>
      {showSubmitButton && (
        <Button
          type="submit"
          className="ml-4 p-2 md:px-4 h-8 text-xs  bg-primary hover:bg-badgeGreen md:text-sm"
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

export default GenericMemberCardPermissionsSelect;
