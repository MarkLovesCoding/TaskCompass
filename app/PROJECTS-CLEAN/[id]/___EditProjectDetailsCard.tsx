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
import { updateProjectDetailsAction } from "../_actions/update-project-details.action.";
import { ProjectDto } from "@/use-cases/project/types";
const formSchema = z.object({
  name: z.string().min(4),
  description: z.string().min(4).max(100),
});

const EditProjectDetailsCard = ({ project }: { project: ProjectDto }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project.name,
      description: project.description,
    },
  });

  const onNewProjectFormSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateProjectDetailsAction(values, project.id);
    console.log("values", values);
    router.refresh();
  };
  return (
    <Form {...form}>
      <form
        className="mt-4 mr-2 "
        onSubmit={form.handleSubmit(onNewProjectFormSubmit)}
      >
        <h2>Update New Project</h2>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem className="mt-2">
                <FormLabel>Name </FormLabel>
                <FormControl>
                  <Input placeholder=" project name" type="text" {...field} />
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
                  <Textarea placeholder=" project description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />{" "}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default EditProjectDetailsCard;
