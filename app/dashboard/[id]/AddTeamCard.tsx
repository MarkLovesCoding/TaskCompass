"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";

import { createNewTeamAction } from "./_actions/create-new-team.action";
import { ValidationError } from "@/use-cases/utils";

const formSchema = z.object({
  name: z.string().min(4),
});
interface FormData {
  name: string;
}

const AddTeamCard = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const [isTeamNameEditing, setIsTeamNameEditing] = useState(false);

  const handleTeamNameBlur = () => {
    // TeamNameField.onBlur();
    setIsTeamNameEditing(false);
  };

  const handleTeamNameClick = () => {
    setIsTeamNameEditing(true); // Trigger the onClick event for the field
  };

  const onNewTeamFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createNewTeamAction(values);
      toast.success("Team created successfully");
      router.refresh();
    } catch (err: any) {
      if (err instanceof ValidationError) {
        toast.error("Validation error: " + err.message);
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error(
          "An unknown error occurred while creating Team. Please try again."
        );
      }
    }
  };
  return (
    <Form {...form}>
      <form
        className="mt-4 mr-2"
        onSubmit={form.handleSubmit(onNewTeamFormSubmit)}
      >
        <h2 className=" text-lg font-bold mb-4 ">Create New Team</h2>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem className="mt-2">
                <FormLabel className="">Team Name</FormLabel>
                <FormControl>
                  <Input
                    className={`header-input text-md max-w-[75%] ${
                      isTeamNameEditing ? "editing" : ""
                    }`}
                    placeholder="New team name"
                    maxLength={25}
                    type="text"
                    spellCheck="false"
                    {...field}
                    onClick={handleTeamNameClick}
                    onChange={field.onChange}
                    onBlur={handleTeamNameBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <DialogFooter className="sm:justify-start mt-10">
          <DialogClose asChild>
            <Button
              type="submit"
              value="Create New Team"
              className=" py-2 rounded-md "
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddTeamCard;
