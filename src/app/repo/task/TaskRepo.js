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
}

export default TaskRepo;
