import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    password: { type: String, required: false },
    projectsAsAdmin: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    projectsAsMember: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    teamsAsAdmin: [{ type: Schema.Types.ObjectId, ref: "Team" }],
    teamsAsMember: [{ type: Schema.Types.ObjectId, ref: "Team" }],
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    avatar: { type: String, default: "default_avatar.png" },
    role: String,
    backgroundImage: { type: String, default: "" },
    resetToken: { type: String || undefined, required: false },
    resetTokenExpiry: { type: Number || undefined, required: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
