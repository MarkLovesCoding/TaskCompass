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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import * as z from "zod";
import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTeamDetailsAction } from "../_actions/update-team-details.action.";
import { useEffect, useState } from "react";
import { teamToDto } from "@/use-cases/team/utils";

const formSchema = z.object({
  name: z.string().min(4).max(25),
});

export function TeamHeader({ team }: { team: TeamDto }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // mode: "onChange",
    defaultValues: {
      name: team.name,
    },
  });
  const { field, fieldState } = useController({
    name: "name", // Name of the field you want to control
    control: form.control, // Pass the form control from useForm
    defaultValue: team.name, // Default value for the field
    rules: {
      // Optional rules for validation
      minLength: 4,
      maxLength: 25,
    },
  });

  // const inputWatch = form.watch("name");
  // console.log(inputWatch);
  // console.log(form.formState.isSubmitSuccessful);
  // // const { field } = useController();
  const [buttonShow, setButtonShow] = useState(false);
  // const [headerText, setHeaderText] = useState(team.name);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);
  // useEffect(() => {
  //   setButtonShow(true);
  // }, [inputWatch]);

  // const handleHeaderClick = () => {
  //   setIsHeaderEditing(true);
  // };

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setButtonShow(true);
  //   setHeaderText(event.target.value);
  // };

  // const handleHeaderInputBlur = () => {
  //   setIsHeaderEditing(false);
  // };
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

  const router = useRouter();

  const onTeamHeaderFormSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateTeamDetailsAction(values, team.id);
    setButtonShow(false);
    console.log("values", values, team.id);
    router.refresh();
  };
  return (
    <div className="flex items-center gap-4">
      <Form {...form}>
        <form
          className="mt-4 mr-2 "
          onSubmit={form.handleSubmit(onTeamHeaderFormSubmit)}
        >
          <div className="flex flex-row justify-start align-middle">
            <LayoutIcon className="w-8 h-8 self-center mr-5" />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem className="self-center">
                    {/* <FormLabel>Name </FormLabel> */}
                    <FormControl>
                      <Input
                        //  placeholder=" project name" type="text" {...field}
                        type="text"
                        className={`header-input
                        ${isHeaderEditing ? "editing" : ""}`}
                        maxLength={25}
                        placeholder="Team Name"
                        {...field}
                        // value={headerText}
                        onClick={handleInputClick}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        // readOnly={!isHeaderEditing}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />{" "}
          </div>

          {buttonShow && <Button type="submit">Update Name</Button>}
        </form>
        {/* <DevTool control={form.control} placement="top-left" /> */}
      </Form>
    </div>
  );
}

//@ts-expect-error
function LayoutIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" x2="21" y1="9" y2="9" />
      <line x1="9" x2="9" y1="21" y2="9" />
    </svg>
  );
}
