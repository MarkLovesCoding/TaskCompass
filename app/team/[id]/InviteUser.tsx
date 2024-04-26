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

import { ValidationError } from "@/use-cases/utils";
import { UserDto } from "@/use-cases/user/types";
import { TeamDto } from "@/use-cases/team/types";
import { UserPlus } from "lucide-react";

interface FormData {
  email: string;
  role: string;
  teamName: string;
  teamId: string;
  inviterName: string;
}
const formSchema = z.object({
  email: z.string().email(),
  role: z.union([z.literal("member"), z.literal("admin")]),
  teamName: z.string(),
  teamId: z.string(),
  inviterName: z.string(),
});

type TRole = "member" | "admin";
const InviteUser = ({ team, inviter }: { team: TeamDto; inviter: UserDto }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "member",
      teamName: team.name,
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
    setInviteRole(value);
  };

  // const onNewInviteUserFormSubmit = async (
  //   values: z.infer<typeof formSchema>
  // ) => {
  //   try {
  //     await inviteUserByEmailAction(values.email, values.role, team, inviter);
  //     toast.success(`Invite sent to: ${values.email}!`);
  //   } catch (err: any) {
  //     if (err instanceof ValidationError) {
  //       toast.error("Validation error: " + err.message);
  //     } else if (err instanceof Error) {
  //       toast.error(err.message);
  //     } else {
  //       toast.error(
  //         "An unknown error occurred while sending user invite. Please try again."
  //       );
  //     }
  //   }
  //   router.refresh();
  // };

  const handleinviteEmailSubmit = async (values: FormData) => {
    try {
      const res = await fetch("/api/auth/invite-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      // if (res.status == 400) {
      //   setMessageType("Error");
      //   setMessage("User with this email is not registered.");
      // }
      if (res.status === 200) {
        setMessageType("Success");
        setMessage(`invite sent to users email`);
        toast.success(`Invite sent to: ${values.email}!`);
        //expand later
      } else {
        toast.error("Response Error: " + res.status);
        setMessageType("Error");
        setMessage("Something went wrong. Please try again in a minute.");
      }
    } catch (error) {
      toast.error("Error sending invite email: " + error);

      console.log(error);
    }
  };
  return (
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
                        if (!isOpen) {
                          setDisableButtons(true);
                        }
                      }}
                      defaultValue={inviteRole}
                    >
                      <SelectTrigger
                        className="pointer-events-none"
                        onClick={(event) => {
                          event.stopPropagation();
                          event.preventDefault();
                        }}
                      >
                        <SelectValue placeholder="User Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                          }}
                          value="admin"
                          className="pointer-events-none"
                        >
                          Admin
                        </SelectItem>
                        <SelectItem
                          onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                          }}
                          value="member"
                          className="pointer-events-none"
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

    // </Dialog>
  );
};

export default InviteUser;
