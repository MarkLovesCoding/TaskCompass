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

  const onNewProjectFormSubmit = async (values: z.infer<typeof formSchema>) => {
    await createNewProjectAction(values, teamId);
    router.refresh();
  };
  return (
    <Form {...form}>
      <form
        className="mt-4 mr-2 "
        onSubmit={form.handleSubmit(onNewProjectFormSubmit)}
      >
        <h2>Create New Project</h2>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem className="mt-2">
                <FormLabel>Name </FormLabel>
                <FormControl>
                  <Input
                    placeholder="New project name"
                    type="text"
                    {...field}
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
                  <Textarea placeholder="New project description" {...field} />
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
