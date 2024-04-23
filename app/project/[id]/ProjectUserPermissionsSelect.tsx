import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select-user-permissions";
import { Button } from "@/components/ui/button";

import { UpdateProjectUserRoleAction } from "../_actions/update-project-user-role.action";
import { ValidationError } from "@/use-cases/utils";

import type { UserDto } from "@/use-cases/user/types";
import type { ProjectDto } from "@/use-cases/project/types";

type ProjectUserBlockProps = {
  user: UserDto;
  project: ProjectDto;
};
const getUserType = (user: UserDto, projectId: string) => {
  if (user.projectsAsAdmin.includes(projectId)) {
    return "admin";
  } else {
    return "member";
  }
};
const ProjectUserPermissionsSelect = ({
  user,
  project,
}: ProjectUserBlockProps) => {
  const existingRole = getUserType(user, project.id);
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
    try {
      await UpdateProjectUserRoleAction(
        user.id,
        project.id,
        selectedRole as "admin" | "member"
      );
      // updateProjectUserRoleAction(user, project, selectedRole);
      toast.success(`User role updated to ${selectedRole}`);
      setShowSubmitButton(false);
      router.refresh();
    } catch (err: any) {
      if (err instanceof ValidationError) {
        toast.error("Validation error: " + err.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(
          "An unknown error occurred while changing user role. Please try again."
        );
      }
    }
  };

  const router = useRouter();

  // Function to handle the change in user type
  return (
    <>
      <Select
        onValueChange={(value) => handleRoleChange(value)}
        defaultValue={getUserType(user, project.id)}
      >
        <SelectTrigger>
          <SelectValue placeholder={getUserType(user, project.id)} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="member">Member</SelectItem>
        </SelectContent>
      </Select>
      {showSubmitButton && (
        <Button
          type="submit"
          className="ml-4 p-2 md:px-4 h-8 text-xs self-center  bg-primary hover:bg-badgeGreen md:text-sm"
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

export default ProjectUserPermissionsSelect;
