"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const Member = () => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/ClientMember");
    },
  });

  return (
    <div>
      <h1>Member Client Session</h1>
      <p className="text-gray-600">{session?.user?.name}</p>
      <p className="text-gray-600">{session?.user?.groups}</p>
    </div>
  );
};

export default Member;
