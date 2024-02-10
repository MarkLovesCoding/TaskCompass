import mongoose, { Schema } from "mongoose";
// mongoose.connect(process.env.MONGODB_URI);
// mongoose.Promise = global.Promise;

const TaskSchema = new Schema(
  {
    name: String,
    description: String,
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    assignees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dueDate: Number,
    startDate: Number,
    complete: Boolean,
    priority: Number,
    status: String,
    category: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    label: String,
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default Task;
