"use client";
import type { TeamDto } from "@/use-cases/team/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { DevTool } from "@hookform/devtools";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import * as z from "zod";
import { LayoutIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTeamDetailsAction } from "../_actions/update-team-details.action";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ValidationError } from "@/use-cases/utils";

const formSchema = z.object({
  name: z.string().min(4).max(25),
});

export function TeamHeader({
  team,
  isCurrentUserAdmin,
  userId,
}: {
  team: TeamDto;
  isCurrentUserAdmin: boolean;
  userId: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team.name,
    },
  });
  const { field, fieldState } = useController({
    name: "name",
    control: form.control,
    defaultValue: team.name,
    rules: {
      minLength: 4,
      maxLength: 25,
    },
  });

  const [buttonShow, setButtonShow] = useState(false);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  const originalName = team.name;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(event); // Trigger the onChange event for the field
    setButtonShow(true);
  };

  const handleInputBlur = () => {
    field.onBlur(); // Trigger the onBlur event for the field
    setIsHeaderEditing(false);
  };

  const handleInputClick = () => {
    setIsHeaderEditing(true); // Trigger the onClick event for the field
  };
  const handleCancel = () => {
    const currentName = form.getValues("name");
    if (currentName !== originalName) {
      form.setValue("name", originalName);
    }
    setButtonShow(false);
  };
  const router = useRouter();

  const onTeamHeaderFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateTeamDetailsAction(values, team.id);
      toast.success(`Team: ${values.name} Updated Successfully!`);
      setButtonShow(false);

      router.refresh();
    } catch (err: any) {
      if (err instanceof ValidationError) {
        toast.error("Validation error: " + err.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(
          "An unknown error occurred while updating team details. Please try again."
        );
      }
    }
  };
  return (
    <div className="flex w-full justify-between flex-row my-2 space-x-3 pr-4 ">
      <Form {...form}>
        <form
          className="w-full flex items-center md:w-[500px] md:flex-row flex-col "
          onSubmit={form.handleSubmit(onTeamHeaderFormSubmit)}
        >
          <div className="flex flex-row  w-full mb-2">
            <div className="flex flex-row items-center justify-start ">
              <div className="flex  pr-4 items-center">
                <LayoutIcon className="w-6 h-6 mr-2 md:w-8 md:h-8 self-center md:mr-4" />
                <div>
                  <Label className="text-base font-bold text-left mr-2">
                    Team
                  </Label>
                </div>
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem className="self-center min-w-[180px] border-solid border-transparent rounded-lg hover:border-gray-700 border-2 max-w-[100%]">
                        <FormControl>
                          <Input
                            type="text"
                            className={`header-input w-full  text-base md:text-lg
                        ${isHeaderEditing ? "editing" : ""}`}
                            maxLength={25}
                            placeholder="Team Name"
                            {...field}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInputClick();
                            }}
                            onChange={handleInputChange}
                            onBlur={handleInputBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />{" "}
              </div>
            </div>
          </div>

          {buttonShow && (
            <div className="flex ml-4 md:mt-0 flex-row  mt-2 mobileLandscape:mt-0 justify-space ">
              <Button
                className="m-1  text-xs  h-8 px-4 "
                type="submit"
                variant="default"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Save
              </Button>
              <Button
                className="m-1 text-xs d h-8 px-4 "
                type="button"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </Form>

      <Badge
        title="Team Permission Level"
        className={` min-w-fit h-fit self-center mr-16
         text-xs px-2 py-[0.2em] m-1 ${
           team.createdBy == userId
             ? "bg-badgePurple"
             : isCurrentUserAdmin
             ? "bg-badgeRed"
             : "bg-badgeBlue"
         } `}
      >
        {team.createdBy == userId
          ? "Creator"
          : isCurrentUserAdmin
          ? `Admin`
          : `Member`}
      </Badge>
    </div>
  );
}
