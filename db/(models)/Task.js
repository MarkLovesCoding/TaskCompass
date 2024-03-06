import mongoose, { Schema } from "mongoose";
// mongoose.connect(process.env.MONGODB_URI);
// mongoose.Promise = global.Promise;

const TaskSchema = new Schema(
  {
    name: String,
    description: String,
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    team: { type: Schema.Types.ObjectId, ref: "Team" },
    assignees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dueDate: Date,
    startDate: Date,
    archived: { type: Boolean, default: false },
    priority: String,
    status: String,
    category: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    label: String,
    orderInLists: {
      priority: {
        type: [String, Number],
        default: ["Medium", 0],
      },
      status: {
        type: [String, Number],
        default: ["Not Started", 0],
      },
      category: {
        type: [String, Number],
        default: ["Other", 0],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default Task;
