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

import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TeamDto } from "@/use-cases/team/types";
import { updateTeamMembersAction } from "../_actions/update-team-members.action";
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
                        : membersList?.map((user, index) => (
                            // <DropdownMenuCheckboxItem
                            //   key={index}
                            //   checked={field.value.includes(user.id)} // Check if user is already in assignees
                            //   onCheckedChange={(checked) => {
                            //     // const updatedMembers = checked
                            //     //   ? [...field.value, user.id] // Add user to assignees array
                            //     //   : field.value.filter(
                            //     //       (member) => member !== user.id
                            //     //     ); // Remove user from assignees array
                            //     if (checked) {
                            //       setMembersList((prev) => {
                            //         if (!prev.some((u) => u.id === user.id)) {
                            //           return [...prev, user];
                            //         }
                            //         return prev;
                            //       });
                            //       setUsersList((prev) =>
                            //         prev.filter((u) => u.id !== user.id)
                            //       );
                            //       // Update assignees field value
                            //     } else {
                            //       setMembersList((prev) =>
                            //         prev.filter((u) => u.id !== user.id)
                            //       );
                            //       setUsersList((prev) => {
                            //         if (!prev.some((u) => u.id === user.id)) {
                            //           return [...prev, user];
                            //         }
                            //         return prev;
                            //       });
                            //     }
                            //     const membersIds = membersList.map(
                            //       (member) => member.id
                            //     );
                            //     form.setValue("members", membersIds);
                            //   }}
                            // >
                            //   {user.name}
                            // </DropdownMenuCheckboxItem>
                            // <DropdownMenuContent>
                            <DropdownMenuItem
                              key={index}
                              // Check if user is already in assignees
                              onSelect={() => {
                                // const updatedMembers = checked
                                //   ? [...field.value, user.id] // Add user to assignees array
                                //   : field.value.filter(
                                //       (member) => member !== user.id
                                //     ); // Remove user from assignees array
                                // if (checked) {
                                // setMembersList((prev) => {
                                //   if (!prev.some((u) => u.id === user.id)) {
                                //     return [...prev, user];
                                //   }
                                //   return prev;
                                // });
                                // setUsersList((prev) =>
                                //   prev.filter((u) => u.id !== user.id)
                                // );
                                if (user.id !== userId) {
                                  setMembersList((prev) =>
                                    prev.filter((u) => u.id !== user.id)
                                  );
                                  setUsersList((prev) => {
                                    if (!prev.some((u) => u.id === user.id)) {
                                      return [...prev, user];
                                    }
                                    return prev;
                                  });
                                }
                                // Update assignees field value
                                // } else {
                                // setMembersList((prev) =>
                                //   prev.filter((u) => u.id !== user.id)
                                // );
                                // setUsersList((prev) => {
                                //   if (!prev.some((u) => u.id === user.id)) {
                                //     return [...prev, user];
                                //   }
                                //   return prev;
                                // });
                                // }
                                const membersIds = membersList.map(
                                  (member) => member.id
                                );
                                form.setValue("members", membersIds);
                                // field.onChange(updatedMembers); // Update assignees field value
                                // setMembersList((prev) => [...prev, user]);
                                // setUsersList((prev) =>
                                //   prev.filter((u) => u.id !== user.id)
                                // );
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
                              {/* <DropdownMenuCheckboxItem
                                key={index}
                                checked={field.value.includes(user.id)} // Check if user is already in assignees
                                onCheckedChange={(checked) => {
                                  // const updatedMembers = checked
                                  //   ? [...field.value, user.id] // Add user to assignees array
                                  //   : field.value.filter(
                                  //       (member) => member !== user.id
                                  //     ); // Remove user from assignees array
                                  if (checked) {
                                    setMembersList((prev) => {
                                      if (!prev.some((u) => u.id === user.id)) {
                                        return [...prev, user];
                                      }
                                      return prev;
                                    });
                                    setUsersList((prev) =>
                                      prev.filter((u) => u.id !== user.id)
                                    );
                                    // Update assignees field value
                                  } else {
                                    setMembersList((prev) =>
                                      prev.filter((u) => u.id !== user.id)
                                    );
                                    setUsersList((prev) => {
                                      if (!prev.some((u) => u.id === user.id)) {
                                        return [...prev, user];
                                      }
                                      return prev;
                                    });
                                  }
                                  const membersIds = membersList.map(
                                    (member) => member.id
                                  );
                                  form.setValue("members", membersIds);
                                  // field.onChange(updatedMembers); // Update assignees field value
                                  // setMembersList((prev) => [...prev, user]);
                                  // setUsersList((prev) =>
                                  //   prev.filter((u) => u.id !== user.id)
                                  // );
                                }}
                              > */}
                              {/* {user.name} */}
                              {/* </DropdownMenuCheckboxItem> */}
                              {/* <DropdownMenuContent> */}
                              <DropdownMenuItem
                                key={index}
                                // Check if user is already in assignees
                                onSelect={() => {
                                  // const updatedMembers = checked
                                  //   ? [...field.value, user.id] // Add user to assignees array
                                  //   : field.value.filter(
                                  //       (member) => member !== user.id
                                  //     ); // Remove user from assignees array
                                  // if (checked) {
                                  //   setMembersList((prev) => {
                                  //     if (
                                  //       !prev.some((u) => u.id === user.id)
                                  //     ) {
                                  //       return [...prev, user];
                                  //     }
                                  //     return prev;
                                  //   });
                                  //   setUsersList((prev) =>
                                  //     prev.filter((u) => u.id !== user.id)
                                  //   );
                                  // Update assignees field value
                                  // } else {

                                  setMembersList((prev) => {
                                    if (!prev.some((u) => u.id === user.id)) {
                                      return [...prev, user];
                                    }
                                    return prev;
                                  });
                                  setUsersList((prev) =>
                                    prev.filter((u) => u.id !== user.id)
                                  );
                                  // setMembersList((prev) =>
                                  //   prev.filter((u) => u.id !== user.id)
                                  // );
                                  // setUsersList((prev) => {
                                  //   if (!prev.some((u) => u.id === user.id)) {
                                  //     return [...prev, user];
                                  //   }
                                  //   return prev;
                                  // });
                                  // }
                                  const membersIds = membersList.map(
                                    (member) => member.id
                                  );
                                  form.setValue("members", membersIds);
                                  // field.onChange(updatedMembers); // Update assignees field value
                                  // setMembersList((prev) => [...prev, user]);
                                  // setUsersList((prev) =>
                                  //   prev.filter((u) => u.id !== user.id)
                                  // );
                                }}
                              >
                                {user.name}
                              </DropdownMenuItem>
                              {/* </DropdownMenuContent> */}
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
        {/* <DialogFooter className="sm:justify-start mt-10"> */}
        <Button
          type="submit"
          value="Update"
          className="  py-2 rounded-md "
          // disabled={isSubmittingForm}
        >
          Update
        </Button>
        {/* </DialogFooter> */}
      </form>
    </Form>
  );
};

export default UpdateTeamMembersCard;
