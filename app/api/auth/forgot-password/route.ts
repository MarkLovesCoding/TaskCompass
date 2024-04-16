import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/db/connectDB";
import User from "@/db/(models)/User";
import Project from "@/db/(models)/Project";
import { UserType } from "@/lib/types/types";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sgMail from "@sendgrid/mail";

export async function POST(req: Request, res: Response): Promise<any> {
  console.log("FIRST LINE IN FORGOT PASSWORD API");
  await connectDB();
  console.log("CONNECTE TO DB");

  const { email } = await req.json();
  //confirm Data exists
  console.log("IN API email DATA___________:", email);

  if (!email) {
    return NextResponse.json({ message: "Email is required" }, { status: 400 });
  }

  //check for duplicate emails
  const existingUser = await User.findOne({ email: email });
  //   .lean()
  //   .exec();
  if (!existingUser) {
    return NextResponse.json(
      {
        message: "Email doesn't exist",
      },
      { status: 409 }
    );
  }
  console.log("existingUser", existingUser);
  //create token
  const resetToken = crypto.randomBytes(20).toString("hex");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const passwordResetExpires = Date.now() + 3600000; // 1 hour from now

  existingUser.resetToken = passwordResetToken;
  existingUser.resetTokenExpiry = passwordResetExpires;
  existingUser.save();
  console.log("existingusersaved", existingUser);
  const resetURL = "http://localhost:3000/reset-password/" + resetToken;
  console.log("RESET URL", resetURL);
  const body = "Reset Password by clicking on following link:" + resetURL;
  const msg = {
    to: email, // Change to your recipient
    from: "mark.halstead.dev@gmail.com", // Change to your verified sender
    subject: "TaskCompass -- Reset Password",
    text: body,
  };
  sgMail.setApiKey(process.env.SENDGRID_API || "");
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent___");
      return new NextResponse("Password Reset Link Sent", { status: 200 });
    })
    .catch(async (err: any) => {
      existingUser.resetToken = undefined;
      existingUser.resetTokenExpiry = undefined;
      await existingUser.save();

      return NextResponse.json(
        { message: "Error Sending Password Link Reset Email", err },
        { status: 500 }
      );
    });

  try {
    await existingUser.save();

    return NextResponse.json(
      { message: "User Saved with Reset Tokens" },
      { status: 201 }
    );
  } catch (err) {
    // console.log(err);
    return NextResponse.json(
      { message: "Error Sending Password Link Reset Email", err },
      { status: 500 }
    );
  }
}
