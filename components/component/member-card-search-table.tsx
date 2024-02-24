"use client";
import { Button } from "@/components/ui/button";
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "@/components/ui/popover";
import {
  CommandInput,
  CommandItem,
  CommandGroup,
  Command,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PlusCircleIcon, PlusIcon, XIcon } from "lucide-react";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { getInitials } from "@/app/utils/getInitials";
import { ProjectDto } from "@/use-cases/project/types";
import { UserDto } from "@/use-cases/user/types";
import { updateProjectMembersAction } from "@/app/PROJECTS-CLEAN/_actions/update-project-members.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Label } from "@/components/ui/label";
const formSchema = z.object({
  users: z.array(z.string()).min(1),
});

export function MemberCardSearchTable({
  userId,
  project,
  teamUsers,
  projectUsers,
}: {
  userId: string;
  project: ProjectDto;
  teamUsers: UserDto[];
  projectUsers: UserDto[];
}) {
  const router = useRouter();
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     users: [...project.members, ...project.admins],
  //   },
  // });
  const filteredTeamUsers = teamUsers.filter(
    (user) => !projectUsers.some((pUser) => pUser.id === user.id)
  );
  const [showCancelButton, setShowCancelButton] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
    // form.setValue("users", usersIds);
  };
  const resetUsers = () => {
    // form.setValue("users", [...project.members, ...project.admins]);
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
  const handleUserHasTasks = (user: UserDto) => {
    console.log("User has tasks assigned to them");
  };
  const handleItemSelect = (user: UserDto) => {
    if (user.id !== userId) {
      if (user.tasks.length > 0) {
        console.log("User has tasks assigned to them");
        return;
      }
      setProjectUsersList((prev) => prev.filter((u) => u.id !== user.id));
      setTeamUsersList((prev) => {
        if (!prev.some((u) => u.id === user.id)) {
          return [...prev, user];
        }
        return prev;
      });
      setShowUpdateButton(true);
      setShowCancelButton(true);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {/* <Button
          className="w-12 h-12 p-3 text-sm rounded-full flex items-center font-semibold gap-1"
          size="icon"
          variant="outline"
        > */}
        <div>
          <PlusCircleIcon className="w-10 h-10" />

          {/* <PlusIcon className="h-4 w-4" /> */}
          <span className="sr-only">Edit Members</span>
        </div>
        {/* </Button> */}
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <Command>
          <CommandInput className="h-9" placeholder="Search members..." />
          <CommandGroup>
            <Label className="m-4">
              <div className="font-semibold">Project Members</div>
            </Label>
            {projectUsers.length === 0
              ? "No other users"
              : projectUsersList?.map((user, index) => (
                  <CommandItem
                    onSelect={() => {
                      if (user.id !== userId) {
                        if (user.tasks.length > 0) {
                          console.log("User has tasks assigned to them");
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
                    key={index}
                    value={user.id}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex w-full items-center gap-2">
                        <Avatar className=" w-12 h-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className={`text-sm bg-gray-500`}>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">{user.name}</span>
                          <div className="flex items-center gap-1">
                            <Badge className="shrink-0">
                              {`${user.tasks.length} tasks`}
                            </Badge>
                            <Badge className="shrink-0" variant="secondary">
                              "Member"
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </span>
                        </div>{" "}
                        <div>
                          {user.id !== userId && (
                            <XIcon className="mr-auto"></XIcon>
                          )}
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
            {/* <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <img
                  alt="Avatar"
                  className="rounded-full border border-gray-200 w-8 h-8 object-cover"
                  height="32"
                  src="/placeholder.svg"
                  style={{
                    aspectRatio: "32/32",
                    objectFit: "cover",
                  }}
                  width="32"
                />
                <div>
                  <span className="font-medium">carol</span>
                  <div className="flex items-center gap-1">
                    <Badge className="shrink-0">5 tasks</Badge>
                    <Badge className="shrink-0" variant="secondary">
                      Member
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    carol@example.com
                  </span>
                </div>
              </div>
            </div> */}
          </CommandGroup>
          <Separator />
          {teamUsersList.length > 0 && (
            <CommandGroup>
              <Label className="m-4">
                <div className="font-semibold">Team Members</div>
              </Label>
              {teamUsersList?.map((user, index) => (
                <CommandItem
                  value={user.id}
                  onSelect={() => {
                    //CHECK IF USER HAS TASKS
                    if (user.tasks.length > 0) {
                      handleUserHasTasks(user);
                      return;
                    }

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
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar className=" w-12 h-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className={`text-sm bg-gray-500`}>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">{user.name}</span>
                        <div className="flex items-center gap-1">
                          <Badge className="shrink-0">
                            {user.tasks.length} tasks
                          </Badge>
                          <Badge className="shrink-0" variant="secondary">
                            Member
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user.email}
                        </span>
                      </div>
                      <div>
                        <PlusIcon></PlusIcon>
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
