"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserDto } from "@/use-cases/user/types";
import { updateProjectMembersAction } from "../_actions/update-project-members.action";
import { ProjectDto } from "@/use-cases/project/types";
import { Filter } from "lucide-react";
const formSchema = z.object({
  users: z.array(z.string()).min(1),
});

const UpdateProjectUsersCard = ({
  userId,
  project,
  teamUsers,
  projectUsers,
}: {
  userId: string;
  project: ProjectDto;
  teamUsers: UserDto[];
  projectUsers: UserDto[];
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      users: [...project.members, ...project.admins],
    },
  });
  const filteredTeamUsers = teamUsers.filter(
    (user) => !projectUsers.some((pUser) => pUser.id === user.id)
  );
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [teamUsersList, setTeamUsersList] =
    useState<UserDto[]>(filteredTeamUsers);
  console.log("teamUsersList", teamUsersList);
  const [projectUsersList, setProjectUsersList] =
    useState<UserDto[]>(projectUsers);

  console.log("projectUsersList", projectUsersList);
  const removedUsers = projectUsersList.filter(
    (member) =>
      !project.members.includes(member.id) &&
      !project.admins.includes(member.id)
  );
  const handleUpdateUsers = () => {
    const usersIds = projectUsersList.map((user) => user.id);
    form.setValue("users", usersIds);
  };
  const resetUsers = () => {
    form.setValue("users", [...project.members, ...project.admins]);
    setProjectUsersList(projectUsers);
    setTeamUsersList(filteredTeamUsers);
    setShowUpdateButton(false);
    setShowCancelButton(false);
  };
  const onUpdateProjectUserFormSubmit = async (
    values: z.infer<typeof formSchema>
  ) => {
    // if (selectedUser) {
    //   const updatedUsers = [...form.getValues("Users"), selectedUser];
    //   form.setValue("Users", updatedUsers);
    // }

    if (values.users) console.log("submitting", values.users);
    //need to check member or admin status
    await updateProjectMembersAction(project.id, values.users);
    setShowUpdateButton(false);
    setShowCancelButton(false);
    router.refresh();
  };
  return (
    <Form {...form}>
      <form
        className="mt-4 mr-2 flex flex-col gap-4 w-full"
        onSubmit={form.handleSubmit(onUpdateProjectUserFormSubmit)}
      >
        <FormField
          control={form.control}
          name="users"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 mb-2">
              <FormLabel className="mt-2">Users Assigned</FormLabel>
              <div className="flex flex-col w-full">
                {projectUsersList.map((user, _index) => (
                  <div className="flex p-4 w-full" key={_index}>
                    {user.name}
                  </div>
                ))}
                <FormControl>
                  {/* {filteredTeamMembers.length === 0 ? (
                    <div>{"No Other Users Available"}</div>
                  ) : ( */}
                  <DropdownMenu onOpenChange={handleUpdateUsers}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Edit </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      // onInteractOutside={(e) => e.preventDefault()}
                      className="w-56"
                    >
                      <DropdownMenuLabel>Project Users</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {projectUsers.length === 0
                        ? "No other users"
                        : projectUsersList?.map((user, index) => (
                            <DropdownMenuItem
                              key={index}
                              // Check if user is already in assignees
                              onSelect={(e) => {
                                e.preventDefault();
                                if (user.id !== userId) {
                                  if (user.tasks.length > 0) {
                                    console.log(
                                      "User has tasks assigned to them"
                                    );
                                    return;
                                  }
                                  setProjectUsersList((prev) =>
                                    prev.filter((u) => u.id !== user.id)
                                  );
                                  setTeamUsersList((prev) => {
                                    if (!prev.some((u) => u.id === user.id)) {
                                      return [...prev, user];
                                    }
                                    return prev;
                                  });
                                  setShowUpdateButton(true);
                                  setShowCancelButton(true);
                                }
                              }}
                            >
                              {user.name}
                            </DropdownMenuItem>
                          ))}
                      {teamUsersList.length > 0 && (
                        <>
                          <DropdownMenuLabel>Team Users</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          {teamUsersList?.map((user, index) => (
                            <>
                              <DropdownMenuItem
                                key={index}
                                // Check if user is already in assignees
                                onSelect={(e) => {
                                  e.preventDefault();
                                  setProjectUsersList((prev) => {
                                    if (!prev.some((u) => u.id === user.id)) {
                                      return [...prev, user];
                                    }
                                    return prev;
                                  });
                                  setTeamUsersList((prev) =>
                                    prev.filter((u) => u.id !== user.id)
                                  );
                                  setShowUpdateButton(true);
                                  setShowCancelButton(true);
                                }}
                              >
                                {user.name}
                              </DropdownMenuItem>
                            </>
                          ))}
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* )} */}
                </FormControl>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-5 flex flex-row">
          {showUpdateButton && (
            <Button type="submit" value="Update" className="  py-2 rounded-md ">
              Update
            </Button>
          )}
          {showCancelButton && (
            <Button
              type="button"
              onClick={resetUsers}
              value="Cancel"
              className="  py-2 rounded-md "
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default UpdateProjectUsersCard;
