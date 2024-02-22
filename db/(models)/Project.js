import mongoose, { Schema } from "mongoose";
// mongoose.connect(process.env.MONGODB_URI);
// mongoose.Promise = global.Promise;

const ProjectSchema = new Schema(
  {
    name: String,
    description: String,
    admins: [{ type: Schema.Types.ObjectId, ref: "User" }],
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    team: { type: Schema.Types.ObjectId, ref: "Team" },
    archived: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);
export default Project;
