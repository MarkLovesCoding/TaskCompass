import mongoose, { Schema } from "mongoose";
// mongoose.connect(process.env.MONGODB_URI);
// mongoose.Promise = global.Promise;

const TaskSchema = new Schema(
  {
    title: String,
    description: String,
    priority: Number,
    // progress: Number,
    status: String,
    category: String,
    project: { type: Schema.Types.ObjectId, ref: "Project" },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    // active: Boolean,
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

export default Task;
