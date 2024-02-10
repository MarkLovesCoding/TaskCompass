import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  PopoverTrigger,
  PopoverContent,
  Popover,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { TaskDto } from "@/use-cases/task/types";

export function TaskCardComponent({
  task,
  projectId,
}: {
  task: TaskDto;
  projectId: string;
}) {
  return (
    <Card className="w-full max-w-md p-4 md:p-8 grid gap-4">
      <CardHeader>
        <div className="grid gap-2">
          <Label htmlFor="taskName">{task.name}</Label>
          <Input id="taskName" placeholder="Enter task name" type="text" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="taskDescription">{task.description}</Label>
          <Textarea id="taskDescription" placeholder="Enter task description" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="inprogress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-full" id="startDate" variant="outline">
                <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                Select Start Date
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar initialFocus mode="single" />
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-full" id="dueDate" variant="outline">
                <CalendarDaysIcon className="mr-1 h-4 w-4 -translate-x-1" />
                Select Due Date
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar initialFocus mode="single" />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-4">
          <Avatar className="h-9 w-9 bg-blue-500 border-2 border-blue-400">
            <AvatarImage alt="User 1" src="/avatar1.jpg" />
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <Avatar className="h-9 w-9 bg-green-500 border-2 border-green-400">
            <AvatarImage alt="User 2" src="/avatar2.jpg" />
            <AvatarFallback>U2</AvatarFallback>
          </Avatar>
          <Button size="sm" variant="outline">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
//@ts-expect-error
function CalendarDaysIcon(props) {
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
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
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
