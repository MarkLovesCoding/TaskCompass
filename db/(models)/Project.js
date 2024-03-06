// import mongoose, { Schema } from "mongoose";
// mongoose.connect(process.env.MONGODB_URI);
// mongoose.Promise = global.Promise;

import mongoose from "mongoose";

const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    name: String,
    description: String,
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    team: { type: Schema.Types.ObjectId, ref: "Team" },
    archived: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    listsNextAvailable: {
      priority: {
        High: { type: Number, default: 0 },
        Medium: { type: Number, default: 0 },
        Low: { type: Number, default: 0 },
      },
      status: {
        "Not Started": { type: Number, default: 0 },
        "Up Next": { type: Number, default: 0 },
        "In Progress": { type: Number, default: 0 },
        Completed: { type: Number, default: 0 },
      },
      category: {
        Household: { type: Number, default: 0 },
        Personal: { type: Number, default: 0 },
        Work: { type: Number, default: 0 },
        School: { type: Number, default: 0 },
        Other: { type: Number, default: 0 },
      },
    },
  },
  {
    timestamps: true,
  }
);

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);
export default Project;
