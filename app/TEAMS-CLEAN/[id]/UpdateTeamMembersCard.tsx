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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TeamDto } from "@/use-cases/team/types";
import { updateTeamMembersAction } from "../../TEAMS-CLEAN/_actions/update-team-members.action";
import getAllUsers from "@/data-access/users/get-all-users.persistence";
import { UserDto } from "@/use-cases/user/types";
import getTeamMembers from "@/data-access/users/get-team-members.persistence";
import { findAssigneesDifferences } from "@/lib/utils";
import { set } from "mongoose";
const formSchema = z.object({
  members: z.array(z.string()).min(1),
  memberId: z.string(),
});

const UpdateTeamMembersCard = ({
  userId,
  team,
  filteredUsers,
  teamMembers,
}: {
  userId: string;
  team: TeamDto;
  filteredUsers: UserDto[];
  teamMembers: UserDto[];
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      members: [...team.members],
    },
  });
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [usersList, setUsersList] = useState<UserDto[]>(filteredUsers);
  const [membersList, setMembersList] = useState<UserDto[]>(teamMembers);
  console.log("membersList", membersList);
  console.log("filteredUsers", filteredUsers);

  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const onAddMemberFormSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("existing members", team.members);
    console.log("current members", membersList);
    setIsSubmittingForm(true);

    if (selectedUser) {
      const updatedMembers = [...form.getValues("members"), selectedUser];
      form.setValue("members", updatedMembers);
    }
    const existingMembers = team.members;
    const currentMembers = membersList.map((member) => member.id);
    const { addedAssignees, removedAssignees } = findAssigneesDifferences(
      existingMembers,
      currentMembers
    );

    await updateTeamMembersAction(team.id, addedAssignees, removedAssignees);
    router.refresh();
  };
  return (
    <Form {...form}>
      <form
        className="mt-4 mr-2 "
        onSubmit={form.handleSubmit(onAddMemberFormSubmit)}
      >
        <h2>Edit Member list</h2>
        <FormField
          control={form.control}
          name="members"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 mb-2">
              <FormLabel className="mt-2">Users Assigned</FormLabel>
              <div className="flex flex-row w-full justify-around">
                {membersList.map((user, _index) => (
                  <div key={_index}>{user.name}</div>
                ))}
                <FormControl>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline"> + </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Team Users</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {teamMembers.length === 0
                        ? "No other users"
                        : teamMembers?.map((user, index) => (
                            <DropdownMenuCheckboxItem
                              key={index}
                              checked={field.value.includes(user.id)} // Check if user is already in assignees
                              onCheckedChange={(checked) => {
                                const updatedMembers = checked
                                  ? [...field.value, user.id] // Add user to assignees array
                                  : field.value.filter(
                                      (member) => member !== user.id
                                    ); // Remove user from assignees array
                                field.onChange(updatedMembers); // Update assignees field value
                              }}
                            >
                              {user.name}
                            </DropdownMenuCheckboxItem>
                          ))}
                      <DropdownMenuLabel>Global Users</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {usersList.length === 0
                        ? "No other users"
                        : usersList?.map((user, index) => (
                            <DropdownMenuCheckboxItem
                              key={index}
                              checked={field.value.includes(user.id)} // Check if user is already in assignees
                              onCheckedChange={(checked) => {
                                const updatedMembers = checked
                                  ? [...field.value, user.id] // Add user to assignees array
                                  : field.value.filter(
                                      (member) => member !== user.id
                                    ); // Remove user from assignees array
                                field.onChange(updatedMembers); // Update assignees field value
                              }}
                            >
                              {user.name}
                            </DropdownMenuCheckboxItem>
                          ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormControl>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="sm:justify-start mt-10">
          {/* <DialogClose asChild> */}
          <Button
            type="submit"
            value="Create New Project"
            className="  py-2 rounded-md "
            disabled={isSubmittingForm}
          >
            Update
            {/* <FontAwesomeIcon icon={faPlus} /> */}
          </Button>
          {/* </DialogClose> */}
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpdateTeamMembersCard;
