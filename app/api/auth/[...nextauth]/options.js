// };
// Import necessary modules
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/db/connectDB";

import User from "@/db/(models)/User";
import Project from "@/db/(models)/Project";
import Team from "@/db/(models)/Team";

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
        let userRole = "GitHub User";
        const existingUser = await User.findOne({
          email: profile.email,
        }).exec();

        if (existingUser && existingUser.role !== "GitHub User") {
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
            const match = await bcrypt.compare(
              credentials.password,
              foundUser.password
            );
            if (match) {
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
        archived: false,
        // listsNextAvailable: {
        //   priority: { High: 0, Medium: 0, Low: 0 },
        //   status: {
        //     "Not Started": 0,
        //     "Up Next": 0,
        //     "In Progress": 0,
        //     Completed: 0,
        //   },
        //   category: { Household: 0, Personal: 0, Work: 0, School: 0, Other: 0 },
        // },
        tasksOrder: {
          priority: { High: [], Medium: [], Low: [] },
          status: {
            "Not Started": [],
            "Up Next": [],
            "In Progress": [],
            Completed: [],
          },
          category: {
            Household: [],
            Personal: [],
            Work: [],
            School: [],
            Other: [],
          },
        },
      };
      const newTeamData = {
        name: "My First Team",
      };

      try {
        //CREATE NEW PROJECT WITH FILLER NAMES
        let initialProjectAssigned = await Project.create({
          name: newProjectData.name,
          description: newProjectData.description,
          tasksOrder: newProjectData.tasksOrder,
        });

        //CREATE NEW USER
        let newUser = await User.create({
          name,
          email,
          role,
          // projects: [newProjectId],
          projectsAsAdmin: [],
          projectsAsMember: [],
          tasks: [],
          teamsAsAdmin: [],
          teamsAsMember: [],
          avatar: "default_avatar.png",
          backgroundImage: "",
        });

        //CREATE NEW TEAM WITH FILLER NAME
        let initialTeamAssigned = await Team.create({
          name: newTeamData.name,
          projects: [],
          users: [],
          createdBy: newUser._id,
        });

        newUser.projectsAsAdmin.push(initialProjectAssigned._id);
        newUser.teamsAsAdmin.push(initialTeamAssigned._id);
        await newUser.save();

        initialProjectAssigned.users.push(newUser._id);
        initialProjectAssigned.team = initialTeamAssigned._id;
        initialProjectAssigned.createdBy = newUser._id;
        await initialProjectAssigned.save();
        initialTeamAssigned.projects.push(initialProjectAssigned._id);
        initialTeamAssigned.users.push(newUser._id);
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
