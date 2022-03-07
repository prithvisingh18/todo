import Errors from "../../utils/errors.js";

class UserRepo {
    constructor(dbInterface) {
        if (
            !!dbInterface === false ||
            !!dbInterface.isUsersDbInterface === false ||
            dbInterface.isUsersDbInterface() === false
        ) {
            throw Errors.createError("Invalid db interface passed for user repo.");
        }
        this.dbInterface = dbInterface;
    }

    isUserRepo() {
        return true;
    }

    async addUser(data) {
        return await this.dbInterface.addUser(data);
    }

    async find({ email, _id }) {
        return await this.dbInterface.find({ email, _id });
    }
}

export default UserRepo;
