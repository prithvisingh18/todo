import mongoose from "mongoose";
import Users from "../models/user.js";

import { removeFistLevelNulls } from "../utils.js";

const { ObjectId } = mongoose.Types;

class UsersDbInterface {
    static isUsersDbInterface() {
        return true;
    }

    static addUser(data) {
        const user = Users(data);
        return user.save();
    }

    static async find({ email, _id }) {
        let q = { email };
        q._id = _id ? new ObjectId(_id) : null;
        q = removeFistLevelNulls(q);
        return Users.find(q);
    }
}

export default UsersDbInterface;
