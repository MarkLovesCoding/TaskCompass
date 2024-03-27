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
import { UpdateProjectUserRoleAction } from "../_actions/update-project-user-role.action";
type MemberCardSearchUserBlockProps = {
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
const MemberCardPermissionsSelect = ({
  user,
  project,
}: MemberCardSearchUserBlockProps) => {
  const existingRole = getUserType(user, project.id);
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
    console.log("project", project);
    console.log("selectedRole", selectedRole);
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
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     users: [...project.members, ...project.admins],
  //   },
  // });
  // const filteredTeamUsers = teamUsers.filter(
  //   (user) => !projectUsers.some((pUser) => pUser.id === user.id)
  // );
  // const [teamUsersList, setTeamUsersList] =
  //   useState<UserDto[]>(filteredTeamUsers);
  // console.log("teamUsersList", teamUsersList);
  // const [projectUsersList, setProjectUsersList] =
  //   useState<UserDto[]>(projectUsers);
  // console.log("projectUsersList", projectUsersList);

  // const getUserTypes = (projectUsers: UserDto[]) => {
  //   const userTypes: Record<string, string> = {}; // Define userTypes as an object with string index signature
  //   projectUsers.forEach((user) => {
  //     // if (user) {
  //     userTypes[user.id as string] = getUserType(user, project.id) as string; // Make sure project.id is defined and correct
  //     // }
  //   });
  //   return userTypes;
  // };

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
          className="ml-4"
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
