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
import { UserPlus, UserPlus2 } from "lucide-react";
import { TInvitedUser } from "@/entities/Team";

interface FormData {
  email: string;
  role: string;
  // teamName: string;
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "member",
      teamId: team.id,
      inviterName: inviter.name,
    },
  });
  type ErrorType = "Error" | "Success";

  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<ErrorType>("Error");

  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [inviteRole, setInviteRole] = useState<TRole>("member");
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
        <Button className="  rounded-full">
          <UserPlus2 aria-label="Invite User" className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form
            className="mt-4 mr-2 "
            onSubmit={form.handleSubmit(handleinviteEmailSubmit)}
          >
            <div className="mb-8">
              <h2 className=" text-lg font-bold mb-4 ">Send Invite Email</h2>
              <p> Invite User to join the team</p>
            </div>
            <div className="mb-8 flex flex-row ">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem className="mt-2">
                      <FormLabel className="">Email:</FormLabel>
                      <FormControl>
                        <Input
                          className={`header-input text-md max-w-[75%] ${
                            isEmailEditing ? "editing" : ""
                          }`}
                          placeholder=""
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
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => {
                  return (
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
                            // className="pointer-events-none"
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
                              // className="pointer-events-none"
                            >
                              Admin
                            </SelectItem>
                            <SelectItem
                              onClick={(event) => {
                                event.stopPropagation();
                                // event.preventDefault();
                              }}
                              value="member"
                              // className="pointer-events-none"
                            >
                              Member
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="flex flex-row justify-between items-center mt-8">
              <Button
                disabled={!isEmailValid || disableButtons}
                type="submit"
                value="Invite User"
                className="  py-2 rounded-md "
              >
                Send Invite {/* <FontAwesomeIcon icon={faPlus} /> */}
              </Button>
              <DialogFooter className="">
                <DialogClose asChild>
                  <Button disabled={disableButtons}>Cancel</Button>
                  {/* <Button type="button" value="Cancel" className="  py-2 rounded-md ">
              Cancel 
            </Button> */}
                </DialogClose>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUser;
