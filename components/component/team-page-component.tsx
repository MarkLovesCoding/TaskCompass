/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/dOukzIDUO5V
 */
import Link from "next/link";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TeamHeader } from "@/app/TEAMS-CLEAN/[id]/team-header";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
} from "@/components/ui/card";
import type { TeamDto } from "@/use-cases/team/types";
export function TeamPageComponent({ team }: { team: TeamDto }) {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <TeamHeader team={team} />
        <Button className="rounded-full ml-auto" size="icon">
          <PlusIcon className="w-4 h-4" />
          <span className="sr-only">New Task</span>
        </Button>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Project 1</CardTitle>
              <CardDescription>
                A project focused on frontend development
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Project 2</CardTitle>
              <CardDescription>
                A project specializing in backend services
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Project 3</CardTitle>
              <CardDescription>
                A project dedicated to quality assurance
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
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

//@ts-expect-error

function PlusIcon(props) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
