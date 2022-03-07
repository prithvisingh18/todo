import Errors from "../../utils/errors.js";

class TaskRepo {
    constructor(taskDbInterface, userDbInterface) {
        if (
            !!taskDbInterface === false ||
            !!taskDbInterface.isTasksDbInterface === false ||
            taskDbInterface.isTasksDbInterface() === false
        ) {
            throw Errors.createError("Invalid db interface passed for task repo.");
        }
        this.taskDbInterface = taskDbInterface;
        if (
            !!userDbInterface === false ||
            !!userDbInterface.isUsersDbInterface === false ||
            userDbInterface.isUsersDbInterface() === false
        ) {
            throw Errors.createError("Invalid db interface passed for user in task repo.");
        }
        this.userDbInterface = userDbInterface;
    }

    isTaskRepo() {
        return true;
    }

    async addTask(data) {
        const userId = data.userId;
        const user = await this.userDbInterface.find({ _id: userId });
        if (user.length === 0) {
            throw Errors.createError("User not found for passed user id.");
        }
        return await this.taskDbInterface.addTask(data);
    }

    async find({ userId }) {
        return await this.taskDbInterface.find({ userId });
    }

    async modify({ _id, order, title, description, status }) {
        const task = await this.taskDbInterface.find({ _id });
        if (task.length === 0) {
            throw Errors.createError("Task not found for passed task id.");
        }
        await this.taskDbInterface.modify({
            _id,
            order,
            title,
            description,
            status,
        });
    }
}

export default TaskRepo;
