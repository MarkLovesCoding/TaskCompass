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
import { useForm, useController } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTeamDetailsAction } from "../_actions/update-team-details.action.";
import { useState } from "react";

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
  const originalName = team.name;
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
  const handleCancel = () => {
    const currentName = form.getValues("name");
    if (currentName !== originalName) {
      form.setValue("name", originalName);
    }
    setButtonShow(false);
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
                    <FormControl>
                      <Input
                        type="text"
                        className={`header-input
                        ${isHeaderEditing ? "editing" : ""}`}
                        maxLength={25}
                        placeholder="Team Name"
                        {...field}
                        onClick={handleInputClick}
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

          {buttonShow && (
            <>
              <Button type="submit">Update Name</Button>
              <Button type="button" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}
        </form>
        {/* <DevTool control={form.control} placement="top-left" /> */}
      </Form>
    </div>
  );
}
