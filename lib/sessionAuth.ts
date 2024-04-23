import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

type Session = {
  user: {
    id: string;
    name: string;
    email: string;
    image: undefined;
    role: string;
  };
};
export async function sessionAuth(
  callbackUrl?: string
): Promise<Session | null> {
  const session = await getServerSession(options);

  if (!session && callbackUrl) {
    redirect(`/api/auth/signin?callbackUrl=/${callbackUrl}`);
  }

  return session;
}
export async function getUserFromSession() {
  const session = await getServerSession(options);
  //   const userId: string = session?.user?.id;
  return {
    getUser: (): { userId: string } =>
      session?.user && { userId: session.user.id },
  };
}
