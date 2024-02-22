import mongoose, { Schema } from "mongoose";
// mongoose.connect(process.env.MONGODB_URI);
// mongoose.Promise = global.Promise;

const TeamSchema = new Schema(
  {
    name: String,
    admins: [{ type: Schema.Types.ObjectId, ref: "User" }],
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
  },
  {
    timestamps: true,
  }
);

const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema);
export default Team;
