"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { createNewTeamAction } from "./_actions/create-new-team.action";

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

  const onNewTeamFormSubmit = async (values: z.infer<typeof formSchema>) => {
    await createNewTeamAction(values);
    router.refresh();
  };
  return (
    <Form {...form}>
      <form
        className="mt-4 mr-2"
        onSubmit={form.handleSubmit(onNewTeamFormSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem className="mt-2">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="New team name" type="text" {...field} />
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
