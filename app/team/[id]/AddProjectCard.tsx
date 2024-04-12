"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNewProjectAction } from "../_actions/create-new-project.action";
import { useState } from "react";
const formSchema = z.object({
  name: z.string().min(4),
  description: z.string().min(4).max(100),
});

const AddProjectCard = ({ teamId }: { teamId: string }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "New Project",
      description: "This is a new project description",
    },
  });
  const [isProjectNameEditing, setIsProjectNameEditing] = useState(false);
  const [isProjectDescriptionEditing, setIsProjectDescriptionEditing] =
    useState(false);

  const handleProjectNameBlur = () => {
    // ProjectNameField.onBlur();
    setIsProjectNameEditing(false);
  };

  const handleProjectNameClick = () => {
    setIsProjectNameEditing(true); // Trigger the onClick event for the field
  };

  const handleProjectDescriptionBlur = () => {
    // descriptionField.onBlur(); // Trigger the onBlur event for the field
    setIsProjectDescriptionEditing(false);
  };
  const handleProjectDescriptionClick = () => {
    setIsProjectDescriptionEditing(true);
  };
  const onNewProjectFormSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("values", values, "teamId", teamId);
    await createNewProjectAction(values, teamId);
    router.refresh();
  };
  return (
    <Form {...form}>
      <form
        className="mt-4 mr-2 "
        onSubmit={form.handleSubmit(onNewProjectFormSubmit)}
      >
        <h2 className=" text-lg font-bold mb-4 ">Create New Project</h2>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem className="mt-2">
                <FormLabel className="">Project Name</FormLabel>
                <FormControl>
                  <Input
                    className={`header-input text-md max-w-[75%] ${
                      isProjectNameEditing ? "editing" : ""
                    }`}
                    placeholder="New project name"
                    maxLength={25}
                    type="text"
                    spellCheck="false"
                    {...field}
                    onClick={handleProjectNameClick}
                    onChange={field.onChange}
                    onBlur={handleProjectNameBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            return (
              <FormItem className="mt-2">
                <FormLabel> Description</FormLabel>
                <FormControl>
                  <Textarea
                    className={`description-input max-w-[95%] resize-none ${
                      isProjectDescriptionEditing ? "editing" : ""
                    }`}
                    placeholder="New project description"
                    spellCheck="false"
                    {...field}
                    maxLength={50}
                    minLength={3}
                    onClick={handleProjectDescriptionClick}
                    onChange={field.onChange}
                    onBlur={handleProjectDescriptionBlur}
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
              value="Create New Project"
              className="  py-2 rounded-md "
            >
              Add
              {/* <FontAwesomeIcon icon={faPlus} /> */}
            </Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddProjectCard;
