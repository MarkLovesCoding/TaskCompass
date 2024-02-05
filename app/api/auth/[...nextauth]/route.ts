import NextAuth from "next-auth";
import { options } from "./options.js";
//@ts-expect-error
const handler = NextAuth(options);
export { handler as GET, handler as POST };
