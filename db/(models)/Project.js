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
    backgroundImage: { type: String, default: "" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    columnOrder: {
      priority: { type: [String], default: ["High", "Medium", "Low"] },
      status: {
        type: [String],
        default: ["Not Started", "Up Next", "In Progress", "Completed"],
      },
      category: {
        type: [String],
        default: ["Household", "Personal", "Work", "School", "Other"],
      },
    },
    tasksOrder: {
      priority: {
        High: [String],
        Medium: [String],
        Low: [String],
      },
      status: {
        "Not Started": [String],
        "Up Next": [String],
        "In Progress": [String],
        Completed: [String],
      },
      category: {
        Household: [String],
        Personal: [String],
        Work: [String],
        School: [String],
        Other: [String],
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
