import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
    },
    {
        timestamps: true,
    }
);

userSchema.index({ createdAt: 1, email: 1 });

const Users = model("Users", userSchema);

export default Users;
