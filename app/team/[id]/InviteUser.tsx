"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select-user-permissions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// import { inviteUserByEmailAction } from "../_actions/invite-user-by-email.action";
import { sendInviteEmailAction } from "../_actions/send-invite-email.action";
import { ValidationError } from "@/use-cases/utils";
import { UserDto } from "@/use-cases/user/types";
import { TeamDto } from "@/use-cases/team/types";
import { MailsIcon, SendIcon, UserPlus, UserPlus2 } from "lucide-react";
import { TInvitedUser } from "@/entities/Team";

interface FormData {
  email: string;
  role: string;
  teamId: string;
  inviterName: string;
}

type TRole = "member" | "admin";
const InviteUser = ({
  team,
  inviter,
  teamUsers,
}: {
  team: TeamDto;
  teamUsers: UserDto[];
  inviter: UserDto;
}) => {
  const emailsOfTeamUsers = teamUsers.map((user: UserDto) => user.email);
  const emailsOfPendingInvites = team.invitedUsers.map(
    (invitedUser: TInvitedUser) => invitedUser.email
  );
  const [emailPendingInvites, setEmailPendingInvites] = useState(
    emailsOfPendingInvites
  );
  useEffect(() => {
    setEmailPendingInvites(
      team.invitedUsers.map((invitedUser: TInvitedUser) => invitedUser.email)
    );
  }, [team.invitedUsers]);
  const router = useRouter();
  const formSchema = z.object({
    email: z
      .string()
      .email()
      .refine(
        (value) => {
          // Check if the email exists in the list of team user emails
          return !(inviter.email === value);
        },
        {
          message: "You're already on this team.",
        }
      )
      .refine(
        (value) => {
          // Check if the email exists in the list of team user emails
          const teamUserEmails = teamUsers.map((user: UserDto) => user.email);
          return !teamUserEmails.includes(value);
        },
        {
          message: "User already on this team.",
        }
      )
      .refine(
        (value) => {
          // Check if the email exists in the list of team user emails
          return !emailPendingInvites.includes(value);
        },
        {
          message: "User invite already sent! Please wait for response.",
        }
      ),

    role: z.union([z.literal("member"), z.literal("admin")]),
    teamId: z.string(),
    inviterName: z.string(),
  });
  const [inviteRole, setInviteRole] = useState<TRole>("member");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: inviteRole,
      teamId: team.id,
      inviterName: inviter.name,
    },
  });
  type ErrorType = "Error" | "Success";

  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<ErrorType>("Error");

  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [disableButtons, setDisableButtons] = useState(false);
  // watch form state  of email field for changes

  // setIsEmailValid(form.formState.errors.email ? false : true);
  const handleEmailBlur = () => {
    // EmailField.onBlur();
    setIsEmailEditing(false);
  };

  const handleEmailClick = () => {
    setIsEmailEditing(true); // Trigger the onClick event for the field
  };

  const handleRoleChange = (value: TRole) => {
    setInviteRole((prev) => value);
    form.setValue("role", value);
  };

  const handleinviteEmailSubmit = async (
    values: z.infer<typeof formSchema>
  ) => {
    try {
      setDisableButtons(true);
      await sendInviteEmailAction(values);
      toast.success(`Invite sent to: ${values.email}!`);
      setDisableButtons(false);
    } catch (err: any) {
      if (err instanceof ValidationError) {
        toast.error("Validation error: " + err.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(
          "An unknown error occurred while sending user invite. Please try again."
        );
      }
    }
    router.refresh();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div title="Invite User">
          <UserPlus2
            aria-label="Invite User"
            className="w-10 h-10 cursor-pointer hover:bg-primary p-2 rounded-full"
          />
          <span className="sr-only">Invite New Team Users</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            className="m-2 "
            onSubmit={form.handleSubmit(handleinviteEmailSubmit)}
          >
            <div className="mb-8">
              <div className="flex flex-row space-x-4">
                <h2 className=" text-lg font-bold mb-4 ">Send Invite Email</h2>
                <MailsIcon className="w-5 h-5" />
              </div>
              <p> Invite User to join the team</p>
            </div>
            <div className="mb-8 flex flex-row space-x-4 ">
              <div className="w-[75%]">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <FormItem className="mt-2">
                        <FormLabel className="">Email:</FormLabel>
                        <FormControl>
                          <Input
                            className={`header-input text-md w-full mr-8 ${
                              isEmailEditing ? "editing" : ""
                            }`}
                            placeholder="email@example.com"
                            type="email"
                            spellCheck="false"
                            {...field}
                            onClick={handleEmailClick}
                            onChange={field.onChange}
                            onBlur={handleEmailBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="w-[25%]">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormLabel className="">User Role</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            handleRoleChange(value as TRole)
                          }
                          onOpenChange={(isOpen) => {
                            if (isOpen) {
                              setDisableButtons(true);
                            } else {
                              setDisableButtons(false);
                            }
                          }}
                          defaultValue={inviteRole}
                        >
                          <SelectTrigger
                            className="h-[40px] w-full"
                            onClick={(event) => {
                              event.stopPropagation();
                              // event.preventDefault();
                            }}
                          >
                            <SelectValue placeholder="User Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem
                              onClick={(event) => {
                                event.stopPropagation();
                                // event.preventDefault();
                              }}
                              value="admin"
                            >
                              Admin
                            </SelectItem>
                            <SelectItem
                              onClick={(event) => {
                                event.stopPropagation();
                                // event.preventDefault();
                              }}
                              value="member"
                            >
                              Member
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className=" w-full items-center mt-8">
              <div className="w-full">
                <Button
                  disabled={!isEmailValid || disableButtons}
                  type="submit"
                  value="Invite User"
                  className="  relative py-2 rounded-md w-full  flex"
                >
                  Send Invite
                  <SendIcon className="absolute left-[60%] w-4 h-4 ml-4" />
                </Button>
              </div>
              {/* <div className="w-[20%] flex justify-center">
                <DialogFooter className="mx-2 w-full">
                  <DialogClose className="w-full " asChild>
                    <Button className="w-full" disabled={disableButtons}>
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </div> */}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUser;
