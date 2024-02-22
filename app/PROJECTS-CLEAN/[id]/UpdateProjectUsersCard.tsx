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
  members: z.array(z.string()).min(1),
});

const UpdateProjectUsersCard = ({
  userId,
  project,
  teamMembers,
  projectMembers,
}: {
  userId: string;
  project: ProjectDto;
  teamMembers: UserDto[];
  projectMembers: UserDto[];
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      members: [...project.members],
    },
  });
  const filteredTeamMembers = teamMembers.filter(
    (member) => !projectMembers.some((pMember) => pMember.id === member.id)
  );
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [teamMembersList, setTeamMembersList] =
    useState<UserDto[]>(filteredTeamMembers);
  console.log("teamMembersList", teamMembersList);
  const [projectMembersList, setProjectMembersList] =
    useState<UserDto[]>(projectMembers);

  console.log("projectMembersList", projectMembersList);
  const removedMembers = projectMembersList.filter(
    (member) => !project.members.includes(member.id)
  );
  const handleUpdateMembers = () => {
    const membersIds = projectMembersList.map((member) => member.id);
    form.setValue("members", membersIds);
  };
  const resetMembers = () => {
    form.setValue("members", [...project.members]);
    setProjectMembersList(projectMembers);
    setTeamMembersList(filteredTeamMembers);
    setShowUpdateButton(false);
    setShowCancelButton(false);
  };
  const onUpdateProjectMemberFormSubmit = async (
    values: z.infer<typeof formSchema>
  ) => {
    // if (selectedUser) {
    //   const updatedMembers = [...form.getValues("members"), selectedUser];
    //   form.setValue("members", updatedMembers);
    // }

    if (values.members) console.log("submitting", values.members);
    await updateProjectMembersAction(project.id, values.members);
    setShowUpdateButton(false);
    setShowCancelButton(false);
    router.refresh();
  };
  return (
    <Form {...form}>
      <form
        className="mt-4 mr-2 flex flex-col gap-4 w-full"
        onSubmit={form.handleSubmit(onUpdateProjectMemberFormSubmit)}
      >
        <FormField
          control={form.control}
          name="members"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 mb-2">
              <FormLabel className="mt-2">Users Assigned</FormLabel>
              <div className="flex flex-col w-full">
                {projectMembersList.map((user, _index) => (
                  <div className="flex p-4 w-full" key={_index}>
                    {user.name}
                  </div>
                ))}
                <FormControl>
                  {/* {filteredTeamMembers.length === 0 ? (
                    <div>{"No Other Users Available"}</div>
                  ) : ( */}
                  <DropdownMenu onOpenChange={handleUpdateMembers}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Edit </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      // onInteractOutside={(e) => e.preventDefault()}
                      className="w-56"
                    >
                      <DropdownMenuLabel>Project Members</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {projectMembers.length === 0
                        ? "No other users"
                        : projectMembersList?.map((user, index) => (
                            <DropdownMenuItem
                              key={index}
                              // Check if user is already in assignees
                              onSelect={(e) => {
                                e.preventDefault();
                                if (user.id !== userId) {
                                  if (user.tasks.length > 0) {
                                    alert("User has tasks assigned to them");
                                    return;
                                  }
                                  setProjectMembersList((prev) =>
                                    prev.filter((u) => u.id !== user.id)
                                  );
                                  setTeamMembersList((prev) => {
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
                      {teamMembersList.length > 0 && (
                        <>
                          <DropdownMenuLabel>Team Members</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          {teamMembersList?.map((user, index) => (
                            <>
                              <DropdownMenuItem
                                key={index}
                                // Check if user is already in assignees
                                onSelect={(e) => {
                                  e.preventDefault();
                                  setProjectMembersList((prev) => {
                                    if (!prev.some((u) => u.id === user.id)) {
                                      return [...prev, user];
                                    }
                                    return prev;
                                  });
                                  setTeamMembersList((prev) =>
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
              onClick={resetMembers}
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
