import Errors from "../../utils/errors.js";

class TaskCreator {
    constructor(taskRepo) {
        if (
            !!taskRepo === false ||
            !!taskRepo.isTaskRepo === false ||
            taskRepo.isTaskRepo() === false
        ) {
            throw Errors.createError("Invalid task repo is passed.");
        }
        this.taskRepo = taskRepo;
    }

    errors = [];
    private = {
        validateOrder: (order) => {
            const parsedInt = parseInt(order);
            if (isNaN(parsedInt)) {
                return false;
            } else {
                return true;
            }
        },
        validateString: (name) => {
            const _name = String(name);
            if (_name === "null" || _name.length === 0) {
                return false;
            } else {
                return true;
            }
        },
        validateStatus: (status) => {
            const _status = String(status);
            const possibleValidStatus = ["inQueue", "inProgress", "done"];
            return possibleValidStatus.findIndex((el) => el === _status) > -1;
        },
    };

    validate(data) {
        /*
        order
        title
        description
        status
        userId
        */
        if (this.private.validateOrder(data.order) === false) {
            this.errors.push("INVALID_ORDER");
        }
        if (!!data.title === false || this.private.validateString(data.title) === false) {
            this.errors.push("INVALID_TITLE");
        }
        if (
            (data.description !== null || data.description !== undefined) &&
            this.private.validateString(data.description) === false
        ) {
            this.errors.push("INVALID_DESCRIPTION");
        }
        if (!!data.status === false || this.private.validateStatus(data.status) === false) {
            this.errors.push("INVALID_STATUS");
        }
        if (!!data.userId === false || this.private.validateString(data.userId) === false) {
            this.errors.push("INVALID_USER_ID");
        }
    }

    async save(task) {
        this.validate(task);
        if (this.errors.length > 0) {
            let error = this.errors.join(", ");
            this.errors = [];
            throw Errors.createError(error);
        }
        try {
            await this.taskRepo.addTask(task);
        } catch (error) {
            throw Errors.createError("Saving task failed.");
        }
    }
}

export default TaskCreator;
