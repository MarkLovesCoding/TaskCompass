import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select-user-permissions";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProjectDto } from "@/use-cases/project/types";
import { UserDto } from "@/use-cases/user/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { UpdateProjectUserRoleAction } from "../_actions/update-project-user-role.action";
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
    // You can perform additional actions here if needed
  };
  const handleRoleChangeSubmit = async () => {
    // You can perform additional actions here if needed
    await UpdateProjectUserRoleAction(
      user.id,
      project.id,
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
