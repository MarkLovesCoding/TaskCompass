"use client";
import { useState, useEffect, useMemo } from "react";
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

import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TeamDto } from "@/use-cases/team/types";
// import { updateTeamMembersAction } from "../_actions/update-team-members.action";
import { updateTeamUsersAction } from "../_actions/update-team-users.action";
import getAllUsers from "@/data-access/users/get-all-users.persistence";
import { UserDto } from "@/use-cases/user/types";
import getTeamMembers from "@/data-access/users/get-team-members.persistence";
import { findAssigneesDifferences } from "@/lib/utils";
import { set } from "mongoose";
import Team from "@/db/(models)/Team";
import { Users } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
const formSchema = z.object({
  members: z.array(z.string()).min(1),
});

const UpdateTeamUsersCard = ({
  userId,
  team,
  globalUsers,
  teamUsers,
}: {
  userId: string;
  team: TeamDto;
  globalUsers: UserDto[];
  teamUsers: UserDto[];
}) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      members: [...team.users],
    },
  });

  const filteredUsers = useMemo(() => {
    return globalUsers.filter((user) => !team.users.includes(user.id));
  }, [globalUsers, team.users]);

  const [usersList, setUsersList] = useState<UserDto[]>(filteredUsers);
  const [teamUsersList, setTeamUsersList] = useState<UserDto[]>(teamUsers);
  console.log("membersList", teamUsersList);
  // console.log("filteredUsers", filteredUsers);
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const resetMembers = () => {
    form.setValue("members", [...team.users]);
    setTeamUsersList(teamUsers);
    setUsersList(filteredUsers);
    setShowUpdateButton(false);
    setShowCancelButton(false);
  };
  const handleUpdateTeamUsers = () => {
    const membersIds = teamUsersList.map((user) => user.id);
    console.log("membersIds", membersIds);
    form.setValue("members", membersIds);
  };
  const onUpdateTeamMemberFormSubmit = async (
    values: z.infer<typeof formSchema>
  ) => {
    // console.log("existing members", team.members);
    // console.log("current members", membersList);
    console.log("values", values);

    await updateTeamUsersAction(team.id, values.members);
    setShowUpdateButton(false);
    setShowCancelButton(false);
    router.refresh();
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>Edit members</div>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Form {...form}>
          <form
            className="mt-4 mr-2 "
            onSubmit={form.handleSubmit(onUpdateTeamMemberFormSubmit)}
          >
            <h2>Edit Member list</h2>
            <FormField
              control={form.control}
              name="members"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3 mb-2">
                  <FormLabel className="mt-2">Users Assigned</FormLabel>
                  <div className="flex flex-row w-full justify-around">
                    {teamUsersList.map((user, _index) => (
                      <div key={_index}>{user.name}</div>
                    ))}
                    <FormControl>
                      <DropdownMenu onOpenChange={handleUpdateTeamUsers}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline"> + </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>Team Users</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {teamUsers.length === 0
                            ? "No other users"
                            : teamUsersList?.map((user, index) => (
                                <DropdownMenuItem
                                  key={index}
                                  // Check if user is already in assignees
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    if (user.id !== userId) {
                                      setTeamUsersList((prev) =>
                                        prev.filter((u) => u.id !== user.id)
                                      );
                                      setUsersList((prev) => {
                                        if (
                                          !prev.some((u) => u.id === user.id)
                                        ) {
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
                          <DropdownMenuLabel>Global Users</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {usersList.length === 0
                            ? "No other users"
                            : usersList?.map((user, index) => (
                                <>
                                  <DropdownMenuItem
                                    key={index}
                                    // Check if user is already in assignees
                                    onSelect={(e) => {
                                      e.preventDefault();
                                      setTeamUsersList((prev) => {
                                        if (
                                          !prev.some((u) => u.id === user.id)
                                        ) {
                                          return [...prev, user];
                                        }
                                        return prev;
                                      });
                                      setUsersList((prev) =>
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
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-5 flex flex-row">
              {showUpdateButton && (
                <Button
                  type="submit"
                  value="Update"
                  className="  py-2 rounded-md "
                >
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
      </PopoverContent>
    </Popover>
  );
};

export default UpdateTeamUsersCard;
