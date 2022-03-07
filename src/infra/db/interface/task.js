import mongoose from "mongoose";
import Tasks from "../models/task.js";

import { removeFistLevelNulls } from "../utils.js";

const { ObjectId } = mongoose.Types;

class TasksDbInterface {
    static isTasksDbInterface() {
        return true;
    }

    static addTask(data) {
        const task = Tasks(data);
        return task.save();
    }

    static find({ userId, _id }) {
        let q = {};
        q.userId = userId ? new ObjectId(userId) : null;
        q._id = _id ? new ObjectId(_id) : null;
        q = removeFistLevelNulls(q);
        return Tasks.find(q);
    }

    static modify({ taskId, order, title, description, status }) {
        let q = {};
        q._id = taskId ? new ObjectId(taskId) : null;
        q = removeFistLevelNulls(q);
        let update = {};
        update.order = order ? order : null;
        update.title = title ? title : null;
        update.description = description ? description : null;
        update.status = status ? status : null;
        update = removeFistLevelNulls(update);
        return Tasks.findOneAndUpdate(q, update);
    }
}

export default TasksDbInterface;
