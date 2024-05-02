import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/db/connectDB";

import { forgotPasswordAction } from "@/app/forgot-password/_actions/forgot-password-action";
import User from "@/db/(models)/User";
import crypto from "crypto";
import { Resend } from "resend";
import { ValidationError } from "@/use-cases/utils";

export async function POST(req: Request, res: Response): Promise<any> {
  await connectDB();

  const { email } = await req.json();
  //confirm Data exists

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }
  try {
    await forgotPasswordAction({ email });
    return NextResponse.json(
      { message: "Password Reset Link Sent" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error | ValidationError).message },
      { status: 500 }
    );
  }
  // await forgotPasswordAction({email});

  // const existingUser = await User.findOne({ email: email });
  // if (!existingUser) {
  //   return NextResponse.json(
  //     {
  //       message: "Email doesn't exist",
  //     },
  //     { status: 409 }
  //   );
  // }

  // const resetToken = crypto.randomBytes(20).toString("hex");
  // const passwordResetToken = crypto
  //   .createHash("sha256")
  //   .update(resetToken)
  //   .digest("hex");
  // const passwordResetExpires = Date.now() + 3600000; // 1 hour from now

  // try {
  //   await User.findByIdAndUpdate(existingUser.id, {
  //     resetToken: passwordResetToken,
  //     resetTokenExpiry: passwordResetExpires,
  //   });
  //   const updatedUser = await User.findById(existingUser.id);
  // } catch (error) {
  //   console.log("Error updating user", error);
  //   return NextResponse.json(
  //     { message: "Error updating user with resetTokens", error },
  //     { status: 500 }
  //   );
  // }

  // const resetURL = "http://localhost:3000/reset-password/" + resetToken;
  // const body = "Reset Password by clicking on following link: " + resetURL;
  // const msg = {
  //   to: email, // Change to your recipient
  //   from: "no_reply@taskcompass.ca", // Change to your verified sender
  //   subject: "TaskCompass -- Reset Password",
  //   text: body,
  // };
  // const resend = new Resend(process.env.RESEND_API);

  // // (async function () {
  // const { data, error } = await resend.emails.send(msg);
  // if (error) {
  //   try {
  //     await User.findOneAndUpdate(
  //       { _id: existingUser.id },
  //       {
  //         resetToken: undefined,
  //         resetTokenExpiry: undefined,
  //       }
  //     );
  //   } catch (error) {
  //     console.log("Error removing reset tokens", error);
  //     return NextResponse.json(
  //       { message: "Error removing reset tokens", error },
  //       { status: 500 }
  //     );
  //   }

  //   return NextResponse.json(
  //     { message: "Error Sending Password Link Reset Email", error },
  //     { status: 500 }
  //   );
  // }

  // console.log("Data - resend:", { data });
  // return new NextResponse("Password Reset Link Sent", { status: 200 });
  // })();
}
