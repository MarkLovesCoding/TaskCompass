import { defaultConfig } from "next/dist/server/config-shared";

const StatusDisplay = ({ status }: { status: string }) => {
  const getColorOfStatus = (status: string) => {
    let color = "bg-slate-700";
    switch (status.toLowerCase()) {
      case "not started":
        color = "bg-red-500";
        break;
      case "in progress":
        color = "bg-yellow-500";
        break;
      case "complete":
        color = "bg-green-500";
        break;
      default:
        break;
    }
    return color;
  };
  return (
    <div
      className={` inline-block rounded-full px-2 py-1 text-xs font-semibold ${getColorOfStatus(
        status
      )}`}
    >
      {status.toLocaleUpperCase()}
    </div>
  );
};

export default StatusDisplay;
