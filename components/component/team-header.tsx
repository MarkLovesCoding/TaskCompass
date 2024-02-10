import type { TeamDto } from "@/use-cases/team/types";
export function TeamHeader({ team }: { team: TeamDto }) {
  return (
    <div className="flex items-center gap-4">
      <LayoutIcon className="w-8 h-8" />
      <div className="grid gap-1">
        <h1 className="text-lg font-bold">{team.name}</h1>
      </div>
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
