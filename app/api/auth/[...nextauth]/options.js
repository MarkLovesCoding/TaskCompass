// };
// Import necessary modules
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/db/connectDB";

import User from "@/db/(models)/User";
import Project from "@/db/(models)/Project";
import Team from "@/db/(models)/Team";
import Task from "@/db/(models)/Task";

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
            avatar: profile.picture,
          };
        }

        return {
          ...profile,
          id: profile.sub,
          role: userRole,
          avatar: profile.picture,
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
      const existingUser = await User.findOne({
        email: user.user.email,
      }).lean();

      if (existingUser && existingUser.role == user.user.role) {
        console.log(
          "User found in MongoDB. Loading existing data:",
          existingUser
        );
        user.user.id = existingUser._id;
        return true; // Continue the sign-in process
      } else if (existingUser) {
        return { error: "User with same email exists as " + existingUser.role };
      }

      // ELSE CREATE NEW USER WITH DEFAULT PROJECTS AND TEAMS
      const { email, name, role } = user.user;
      const newProjectData = {
        name: "My Personal Project",
        description: "This is your default project",
      };
      const newTeamData = {
        name: "My First Team",
      };

      try {
        //CREATE NEW PROJECT WITH FILLER NAMES
        let initialProjectAssigned = await Project.create({
          name: newProjectData.name,
          description: newProjectData.description,
        });

        //CREATE NEW USER
        let newUser = await User.create({
          name,
          email,
          role,
          // projects: [newProjectId],
          projects: [],
          tasks: [],
          teams: [],
          avatar: "default_avatar.png",
        });

        //CREATE NEW TEAM WITH FILLER NAME
        let initialTeamAssigned = await Team.create({
          name: newTeamData.name,
          projects: [],
          members: [],
        });

        newUser.projects.push(initialProjectAssigned._id);
        newUser.teams.push(initialTeamAssigned._id);
        await newUser.save();

        initialProjectAssigned.members.push(newUser._id);
        await initialProjectAssigned.save();
        initialTeamAssigned.projects.push(initialProjectAssigned._id);
        initialTeamAssigned.members.push(newUser._id);
        await initialTeamAssigned.save();

        // await Project.findByIdAndUpdate(
        //   initialProjectAssigned._id,
        //   {
        //     $addToSet: {
        //       members: newUser._id,
        //     },
        //   },
        //   { new: true }
        // );

        // await User.findByIdAndUpdate(
        //   newUser._id,
        //   {
        //     $addToSet: {
        //       teams: new mongoose.Types.ObjectId(initialTeamAssigned._id),
        //       projects: new mongoose.Types.ObjectId(initialProjectAssigned._id),
        //     },
        //   },
        //   { new: true }
        // );
        // await Team.findByIdAndUpdate(
        //   initialTeamAssigned._id,
        //   {
        //     $addToSet: {
        //       members: new mongoose.Types.ObjectId(newUser._id),
        //       projects: new mongoose.Types.ObjectId(initialProjectAssigned._id),
        //     },
        //   },
        //   { new: true }
        // );

        //update user with object id for token
        user.user.id = newUser._id;
      } catch (error) {
        console.error("Error creating User and Defaults:", error);
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
