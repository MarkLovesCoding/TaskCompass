import mongoose, { Schema } from "mongoose";

const TeamSchema = new Schema(
  {
    name: String,
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    // members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    backgroundImage: { type: String, default: "" },
    backgroundImageThumbnail: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema);
export default Team;
