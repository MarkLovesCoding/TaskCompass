import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const InvalidTokenComponent = () => {
  return (
    <div className="flex flex-col justify-center space-y-4">
      <h2>
        Token is invalid or expired. Please contact the team owner for
        assistance.
      </h2>
      <p>
        {`You may register manually below to join TaskCompass for free. To join requested
        Team, you'll require a valid invite from a Team Admin.`}
      </p>
      <Link href="/registration">
        <Button className=" py-2 px-4">Back to Registration</Button>
      </Link>
    </div>
  );
};

export default InvalidTokenComponent;
