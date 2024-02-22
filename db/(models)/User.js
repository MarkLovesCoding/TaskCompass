import mongoose, { Schema } from "mongoose";
// mongoose.connect(process.env.MONGODB_URI);
// mongoose.Promise = global.Promise;

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    projectsAsAdmin: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    projectsAsMember: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    teamsAsAdmin: [{ type: Schema.Types.ObjectId, ref: "Team" }],
    teamsAsMember: [{ type: Schema.Types.ObjectId, ref: "Team" }],
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    avatar: String,
    role: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
