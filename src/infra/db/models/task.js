import mongoose from "mongoose";
const { Schema, model, ObjectId } = mongoose;

const taskSchema = new Schema(
    {
        order: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String },
        status: { type: String },
        userId: { type: ObjectId },
    },
    {
        timestamps: true,
    }
);

taskSchema.index({ createdAt: 1, email: 1 });

const Tasks = model("Tasks", taskSchema);

export default Tasks;
