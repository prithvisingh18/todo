import mongoose from "mongoose";
import Tasks from "../models/task.js";

const { ObjectId } = mongoose.Types;

class TasksDbInterface {
    static isTasksDbInterface() {
        return true;
    }

    static addTask(data) {
        const task = Tasks(data);
        return task.save();
    }

    static find({ userId }) {
        const q = {};
        q.userId = userId ? new ObjectId(userId) : null;
        return Tasks.find(q);
    }
}

export default TasksDbInterface;
