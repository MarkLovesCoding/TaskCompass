// };
// Import necessary modules
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/app/utils/connectDB";

import User from "@/app/(models)/User";
import Project from "@/app/(models)/Project";
import Task from "@/app/(models)/Task";

import mongoose from "mongoose";
import bcrypt from "bcrypt";
// let newUser;

export const options = {
  pages: {
    signIn: "/",
    error: "/auth/error/",
    // signOut: "/",
  },
  providers: [
    GitHubProvider({
      async profile(profile) {
        await connectDB();
        console.log("Profile GitHub: ", profile);

        let userRole = "GitHub User";
        const existingUser = await User.findOne({
          email: profile.email,
        }).exec();

        if (existingUser && existingUser.role !== "GitHub User") {
          console.log(
            existingUser.role,
            " with the same email already exists:"
          );
          // return null; // Return null to prevent the registration
          return {
            ...profile,
            id: existingUser._id,
            role: userRole,
          };
        }

        return {
          ...profile,
          role: userRole,
        };
      },
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_Secret,
      allowDangerousEmailAccountLinking: process.env.ACCOUNT_LINK_BOOL,
    }),
    GoogleProvider({
      async profile(profile) {
        await connectDB();
        console.log("Profile Google: ", profile);

        let userRole = "Google User";
        const existingUser = await User.findOne({
          email: profile.email,
        }).exec();

        if (existingUser && existingUser.role !== "Google User") {
          console.log(
            existingUser.role,
            "User with the same email already exists",

            ". Signing In Via Linked Account."
          );
          // throw new Error("User With The same Email ALready Exists");
          // return true; // Return null to prevent the registration
          return {
            ...profile,
            id: existingUser._id,
            role: userRole,
          };
        }

        return {
          ...profile,
          id: profile.sub,
          role: userRole,
        };
      },
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_Secret,
      allowDangerousEmailAccountLinking: process.env.ACCOUNT_LINK_BOOL,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "email:",
          type: "email",
          placeholder: "Your Email",
        },
        password: {
          label: "password:",
          type: "password",
          placeholder: "Your Password",
        },
      },
      //@ts-expect-error /
      async authorize(credentials) {
        await connectDB();
        try {
          const foundUser = await User.findOne({
            email: credentials.email,
          }).exec();
          if (foundUser && foundUser.role != "Email User") {
            // Error sent to client side

            throw new Error("User Already Exists via Google/GitHub");
          }

          if (foundUser) {
            console.log("User Exists");
            console.log("credentials.password,", credentials.password);
            console.log("foundUser.password", foundUser.password);
            const match = await bcrypt.compare(
              credentials.password,
              foundUser.password
            );
            if (match) {
              console.log("Passwords match");
              //@ts-expect-error // user pass deleted temporary variable so OK
              delete foundUser.password;
              foundUser["role"] = "Email User";
              return foundUser;
            } else {
              // Error sent to client side
              throw new Error("Incorrect password");
            }
          }
        } catch (error) {
          throw new Error(error);
        }
        return null; // Not authenticated
      },
    }),
  ],
  callbacks: {
    async signIn(user) {
      await connectDB();

      // Check if the user already exists in the database
      // console.log("User", user, "ACCOUNT", account, "PROFILE", profile);
      const existingUser = await User.findOne({
        email: user.user.email,
        // role: user.user.role,
      }).lean();

      if (existingUser && existingUser.role == user.user.role) {
        console.log(
          "User found in MongoDB. Loading existing data:",
          existingUser
        );
        user.user.id = existingUser._id;
        return true; // Continue the sign-in process
      } else if (existingUser) {
        console.log(
          "user with same email ------------------------------------------"
        );
        return { error: "User with same email exists as " + existingUser.role };
      }

      // Save the new user data to MongoDB
      const { id, email, name, role } = user.user;
      const newProjectData = {
        name: "My Personal Tasks",
        isDefault: true,
      };

      let initialProjectAssigned, newProjectId;
      try {
        initialProjectAssigned = await Project.create({
          name: newProjectData.name,
          isDefault: newProjectData.isDefault,
        });
        newProjectId = initialProjectAssigned._id;
      } catch (error) {
        console.error("Error creating initial Project:", error);
        return false;

        // Handle the error or return from the function as needed
      }
      let newUser;
      try {
        newUser = await User.create({
          name,
          email,
          role,
          projects: [newProjectId],
          tasks: [],
        });
        user.user.id = newUser._id;
      } catch (error) {
        console.error("Error creating user:", error);
        return false;
        // Handle the error or return from the function as needed
      }

      const userIDNEW = new mongoose.Types.ObjectId(newUser._id);
      try {
        const updatedProject = await Project.findByIdAndUpdate(
          initialProjectAssigned._id,
          {
            $addToSet: {
              users: userIDNEW,
            },
          },
          { new: true }
        );
      } catch (error) {
        console.error("Error updating Project:", error);
        return false;

        // Handle the error or return from the function as needed
      }

      return true; // Continue the sign-in process
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user = { ...session.user, id: token.id };
      }
      if (session?.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  // session: {
  //   expires,
  //   jwt: true, // Use JSON Web Tokens for sessions
  // },
};
