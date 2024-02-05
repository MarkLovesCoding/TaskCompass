const ProgressDisplay = ({ progress }: { progress: number }) => {
  return (
    <>
      <div className="flex items-center mb-2">
        <p className="  font-bold text-muted-foreground ">Progress:</p>
      </div>
      <div className="bg-white  w-full rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </>
  );
};

export default ProgressDisplay;
