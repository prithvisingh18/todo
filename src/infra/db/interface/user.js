import Users from "../models/user.js";

class UsersDbInterface {
    static isUserDbInterface() {
        return true;
    }

    static addUser(data) {
        const user = Users(data);
        return user.save();
    }

    static find({ email }) {
        return Users.find({ email });
    }
}

export default UsersDbInterface;
